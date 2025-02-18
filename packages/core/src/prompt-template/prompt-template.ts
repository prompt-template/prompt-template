/* eslint-disable no-unused-vars */
import stripIndent from 'strip-indent'

import type {
  ExtractCreatePromptTemplateResult,
  ExtractInputVariableName,
  ExtractInputVariableNameOptional,
  ExtractInputVariableNameRequired,
  PromptTemplateBase,
  PromptTemplateFormatInputValues,
  PromptTemplateFormatInputValuesBase,
  PromptTemplateFormatOptions,
  PromptTemplateInputValue,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableConfig,
  PromptTemplateInputVariableName,
  PromptTemplateOptions,
  PromptTemplateStrings,
  ValidateInputVariables,
} from './types.js'

function getCreatePromptTemplate(options: PromptTemplateOptions) {
  function createPromptTemplate<
    T extends PromptTemplateStrings | PromptTemplateOptions,
    const InputVariables extends readonly PromptTemplateInputVariable[],
  >(
    templateStringsOrOptions: T,
    ...inputVariables: [...ValidateInputVariables<InputVariables>]
  ): ExtractCreatePromptTemplateResult<T, InputVariables> {
    if (isPromptTemplateOptions(templateStringsOrOptions)) {
      return getCreatePromptTemplate({
        ...options,
        ...templateStringsOrOptions,
      }) as ExtractCreatePromptTemplateResult<T, InputVariables>
    }

    return new PromptTemplate<InputVariables>(
      templateStringsOrOptions,
      inputVariables,
      options,
    ) as ExtractCreatePromptTemplateResult<T, InputVariables>
  }

  return createPromptTemplate
}

const createPromptTemplate = getCreatePromptTemplate({})

const promptTemplateFromString = (string: string) =>
  new PromptTemplate([string], [], { dedent: false })

export class PromptTemplate<
  InputVariables extends readonly PromptTemplateInputVariable[],
> implements PromptTemplateBase
{
  static create = createPromptTemplate

  static from = promptTemplateFromString

  readonly templateStrings: PromptTemplateStrings

  readonly inputVariables: ValidateInputVariables<InputVariables>

  #dedent: boolean

  description?: string | undefined

  prefix: string

  suffix: string

  constructor(
    templateStrings: PromptTemplateStrings,
    inputVariables: ValidateInputVariables<InputVariables>,
    options: PromptTemplateOptions = {},
  ) {
    this.templateStrings = templateStrings
    this.inputVariables = inputVariables

    this.#validateInputVariables()

    this.#dedent = options.dedent ?? true
    this.description = options.description
    this.prefix = options.prefix ?? ''
    this.suffix = options.suffix ?? ''
  }

  format(
    inputValues: PromptTemplateFormatInputValues<InputVariables>,
    options: PromptTemplateFormatOptions = {
      validateInputValues: true,
    },
  ): string {
    const normalizedInputValues: PromptTemplateFormatInputValuesBase =
      inputValues || {}

    if (options.validateInputValues) {
      this.#validateInputValues(normalizedInputValues)
    }

    let prompt = this.#interleave({
      onPromptTemplate: (nestedPromptTemplate) =>
        nestedPromptTemplate.format(normalizedInputValues, {
          validateInputValues: false,
        }),
      onInputVariableName: (inputVariableName) =>
        normalizedInputValues[inputVariableName] ?? '',
      //
      onInputVariableConfig: (inputVariableConfig) => {
        let inputValue =
          normalizedInputValues[inputVariableConfig.name] ??
          inputVariableConfig.default ??
          ''

        if (inputVariableConfig?.schema) {
          inputValue = inputVariableConfig.schema.parse(inputValue)
        }

        if (inputVariableConfig?.onFormat) {
          inputValue = inputVariableConfig.onFormat(inputValue)
        }

        return inputValue
      },
    })

    prompt = this.#dedent ? stripIndent(prompt).trim() : prompt

    prompt = `${this.prefix}${prompt}${this.suffix}`

    return prompt
  }

  /**
   * Recursively extracts and deduplicates all input variable names.
   */
  getInputVariableNames(): ExtractInputVariableName<InputVariables>[] {
    const inputVariableNamesSet = new Set<PromptTemplateInputVariableName>()

    this.#walkInputVariables(this.inputVariables, {
      onInputVariableName: (inputVariableName) => {
        inputVariableNamesSet.add(inputVariableName)
      },
      onInputVariableConfig: (inputVariableConfig) => {
        inputVariableNamesSet.add(inputVariableConfig.name)
      },
    })

    const inputVariableNames = Array.from(inputVariableNamesSet)

    return inputVariableNames as ExtractInputVariableName<InputVariables>[]
  }

  /**
   * Recursively extracts and deduplicates all required input variable names (without a default value).
   */
  getInputVariableNamesRequired(): ExtractInputVariableNameRequired<InputVariables>[] {
    const inputVariableNamesRequiredSet =
      new Set<PromptTemplateInputVariableName>()

    this.#walkInputVariables(this.inputVariables, {
      onInputVariableName: (inputVariableName) => {
        inputVariableNamesRequiredSet.add(inputVariableName)
      },
      onInputVariableConfig: (inputVariableConfig) => {
        if (!isInputVariableConfigOptional(inputVariableConfig)) {
          inputVariableNamesRequiredSet.add(inputVariableConfig.name)
        }
      },
    })

    const inputVariableNamesRequired = Array.from(inputVariableNamesRequiredSet)

    return inputVariableNamesRequired as ExtractInputVariableNameRequired<InputVariables>[]
  }

  /**
   * Recursively extracts and deduplicates all optional input variable names (with a default value and filtering out required input variable names).
   */
  getInputVariableNamesOptional(): ExtractInputVariableNameOptional<InputVariables>[] {
    const inputVariableNamesOptionalAllSet =
      new Set<PromptTemplateInputVariableName>()

    const inputVariableNamesRequiredSet =
      new Set<PromptTemplateInputVariableName>()

    this.#walkInputVariables(this.inputVariables, {
      onInputVariableName: (inputVariableName) => {
        inputVariableNamesRequiredSet.add(inputVariableName)
      },
      onInputVariableConfig: (inputVariableConfig) => {
        if (isInputVariableConfigOptional(inputVariableConfig)) {
          inputVariableNamesOptionalAllSet.add(inputVariableConfig.name)
        } else {
          inputVariableNamesRequiredSet.add(inputVariableConfig.name)
        }
      },
    })

    const inputVariableNamesOptional: PromptTemplateInputVariableName[] = []

    for (const inputVariableNameOptionalAll of inputVariableNamesOptionalAllSet) {
      if (!inputVariableNamesRequiredSet.has(inputVariableNameOptionalAll)) {
        inputVariableNamesOptional.push(inputVariableNameOptionalAll)
      }
    }

    return inputVariableNamesOptional as ExtractInputVariableNameOptional<InputVariables>[]
  }

  #walkInputVariables(
    inputVariables: readonly PromptTemplateInputVariable[],
    callbacks: {
      onInputVariableName?: (
        inputVariableName: PromptTemplateInputVariableName,
      ) => void
      onInputVariableConfig?: (
        inputVariableConfig: PromptTemplateInputVariableConfig,
      ) => void
      onPromptTemplate?: (promptTemplate: PromptTemplateBase) => void
    },
  ) {
    for (const inputVariable of inputVariables) {
      if (isInputVariableName(inputVariable)) {
        callbacks.onInputVariableName?.(inputVariable)
        //
      } else if (isInputVariableConfig(inputVariable)) {
        callbacks.onInputVariableConfig?.(inputVariable)
        //
      } else {
        callbacks.onPromptTemplate?.(inputVariable)

        this.#walkInputVariables(inputVariable.inputVariables, callbacks)
      }
    }
  }

  #interleave(callbacks: {
    onInputVariableName: (
      inputVariableName: PromptTemplateInputVariableName,
    ) => PromptTemplateInputValue
    onInputVariableConfig: (
      inputVariableConfig: PromptTemplateInputVariableConfig,
    ) => PromptTemplateInputValue
    onPromptTemplate: (
      promptTemplate: PromptTemplateBase,
    ) => PromptTemplateInputValue
  }): string {
    let accumulatedPrompt = ''
    let inputVariable: PromptTemplateInputVariable
    let inputValue: PromptTemplateInputValue

    for (let i = 0; i < this.templateStrings.length; i += 1) {
      accumulatedPrompt += this.templateStrings[i]

      if (i < this.inputVariables.length) {
        inputVariable = this.inputVariables[i]!

        if (isInputVariableName(inputVariable)) {
          inputValue = callbacks.onInputVariableName(inputVariable)
          //
        } else if (isInputVariableConfig(inputVariable)) {
          inputValue = callbacks.onInputVariableConfig(inputVariable)
          //
        } else {
          inputValue = callbacks.onPromptTemplate(inputVariable)
        }

        accumulatedPrompt += newLineRegExp.test(inputValue)
          ? preserveIndent(inputValue, accumulatedPrompt)
          : inputValue
      }
    }

    return accumulatedPrompt
  }

  #validateInputVariables() {
    if (!Array.isArray(this.inputVariables)) {
      throw new Error('Input variables must be an array')
    }

    for (const inputVariable of this.inputVariables) {
      if (
        !isInputVariableName(inputVariable) &&
        !isInputVariableConfig(inputVariable) &&
        !(inputVariable instanceof PromptTemplate)
      ) {
        throw new Error(
          'Input variables must be a string literal, an object with a `name` property, or a `PromptTemplate` instance',
        )
      }
    }
  }

  #validateInputValues(inputValues: PromptTemplateFormatInputValuesBase) {
    if (typeof inputValues !== 'object' || inputValues === null) {
      throw new Error('Input values must be an object')
    }

    const inputVariableNamesRequired: string[] =
      this.getInputVariableNamesRequired()

    for (const inputVariableNameRequired of inputVariableNamesRequired) {
      if (!(inputVariableNameRequired in inputValues)) {
        throw new Error(
          `Missing input value for "${inputVariableNameRequired}"`,
        )
      }
    }
  }
}

function isInputVariableName(
  inputVariable: PromptTemplateInputVariable,
): inputVariable is PromptTemplateInputVariableName {
  return typeof inputVariable === 'string' && inputVariable.length > 0
}

function isInputVariableConfig(
  inputVariable: PromptTemplateInputVariable,
): inputVariable is PromptTemplateInputVariableConfig {
  return (
    inputVariable !== null &&
    typeof inputVariable === 'object' &&
    'name' in inputVariable &&
    isInputVariableName(inputVariable.name)
  )
}

function isInputVariableConfigOptional(
  inputVariable: PromptTemplateInputVariable,
): inputVariable is PromptTemplateInputVariableConfig & { default: string } {
  return isInputVariableConfig(inputVariable) && 'default' in inputVariable
}

function isPromptTemplateStrings(
  templateStringsOrOptions: PromptTemplateStrings | PromptTemplateOptions,
): templateStringsOrOptions is PromptTemplateStrings {
  return Array.isArray(templateStringsOrOptions)
}

export function isPromptTemplateOptions(
  templateStringsOrOptions: PromptTemplateStrings | PromptTemplateOptions,
): templateStringsOrOptions is PromptTemplateOptions {
  return !isPromptTemplateStrings(templateStringsOrOptions)
}

const newLineRegExp = /\r?\n|\r/
const lastLineRegExp = /(?:\r?\n|\r|^)([^\r\n]*)$/
const nonWhitespaceRegExp = /[^\s]/gu

function preserveIndent(inputValue: string, accumulatedPrompt: string) {
  const lastLine = accumulatedPrompt.match(lastLineRegExp)?.[1] || ''

  const lastLineIndent = lastLine.replace(nonWhitespaceRegExp, (match) =>
    ' '.repeat(match.length),
  )

  return inputValue
    .split(newLineRegExp)
    .map((line, i) => (i === 0 ? line : lastLineIndent + line))
    .join('\n')
}
