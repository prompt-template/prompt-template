/* eslint-disable no-unused-vars */
import { IsStringLiteral } from 'type-fest'

import { PromptTemplate } from './prompt-template.js'

// ##################
// PromptTemplateBase
// ##################

export interface PromptTemplateBase {
  readonly templateStrings: PromptTemplateStrings

  readonly inputVariables: readonly PromptTemplateInputVariable[]

  prefix: string

  suffix: string

  format(
    inputValues?: PromptTemplateFormatInputValuesBase | void,
    options?: PromptTemplateFormatOptions,
  ): string

  getInputVariableNames(): PromptTemplateInputVariableName[]

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]
}

// ###########################
// PromptTemplateInputVariable
// ###########################

export type PromptTemplateInputVariableName = string

export type PromptTemplateInputVariableNameError =
  'Error: `PromptTemplateInputVariableName` must be a string literal type'

export interface PromptTemplateInputVariableConfig {
  name: PromptTemplateInputVariableName
  default?: PromptTemplateInputValue
  schema?: {
    parse: (inputValue: PromptTemplateInputValue) => PromptTemplateInputValue
  }
  onFormat?: (inputValue: PromptTemplateInputValue) => PromptTemplateInputValue
}

export type PromptTemplateStrings = readonly string[]

export type PromptTemplateInputVariable =
  | PromptTemplateInputVariableName
  | PromptTemplateInputVariableConfig
  | PromptTemplateBase

/**
 * Validates input variable names are a string literal type.
 *
 * Note: We only need to handle `PromptTemplateInputVariableName`s and `PromptTemplateInputVariableConfig`s
 * as `PromptTemplateInputVariable`s in nested `PromptTemplate`s should already be validated.
 */
export type ValidateInputVariables<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = {
  [Index in keyof InputVariables]: InputVariables[Index] extends PromptTemplateInputVariableName
    ? IfStringLiteral<
        InputVariables[Index],
        InputVariables[Index],
        PromptTemplateInputVariableNameError
      >
    : InputVariables[Index] extends { name: infer InputVariableName }
      ? IfStringLiteral<
          InputVariableName,
          InputVariables[Index],
          InputVariables[Index] & { name: PromptTemplateInputVariableNameError }
        >
      : InputVariables[Index]
}

/**
 * Recursively extracts all input variable names.
 */
export type ExtractInputVariableName<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends PromptTemplateInputVariableName
    ? IfStringLiteral<InputVariable, InputVariable, never>
    : InputVariable extends { name: infer InputVariableName }
      ? IfStringLiteral<InputVariableName, InputVariableName, never>
      : InputVariable extends PromptTemplate<infer NestedInputVariables>
        ? ExtractInputVariableName<NestedInputVariables>
        : never
  : never

/**
 * Recursively extracts required input variable names (without a default value).
 */
export type ExtractInputVariableNameRequired<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends PromptTemplateInputVariableName
    ? IfStringLiteral<InputVariable, InputVariable, never>
    : InputVariable extends {
          name: infer InputVariableName
          default?: undefined
        }
      ? IfStringLiteral<InputVariableName, InputVariableName, never>
      : InputVariable extends PromptTemplate<infer NestedInputVariables>
        ? ExtractInputVariableNameRequired<NestedInputVariables>
        : never
  : never

/**
 * Recursively extracts all optional input variable names (with a default value).
 */
type ExtractInputVariableNameOptionalAll<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends {
      name: infer InputVariableName
      default: PromptTemplateInputValue
    }
    ? IfStringLiteral<InputVariableName, InputVariableName, never>
    : InputVariable extends PromptTemplate<infer NestedInputVariables>
      ? ExtractInputVariableNameOptionalAll<NestedInputVariables>
      : never
  : never

/**
 * Recursively extracts optional input variable names (filtering out required input variable names)
 */
export type ExtractInputVariableNameOptional<
  InputVariables extends readonly PromptTemplateInputVariable[],
  InputVariableNameRequired extends
    PromptTemplateInputVariableName = ExtractInputVariableNameRequired<InputVariables>,
> =
  ExtractInputVariableNameOptionalAll<InputVariables> extends infer InputVariableNameOptionalAll
    ? InputVariableNameOptionalAll extends PromptTemplateInputVariableName
      ? InputVariableNameOptionalAll extends InputVariableNameRequired
        ? never
        : InputVariableNameOptionalAll
      : never
    : never

// ####################
// PromptTemplateFormat
// ####################

export type PromptTemplateInputValue = string

export interface PromptTemplateFormatInputValuesBase {
  [inputVariableName: string]: PromptTemplateInputValue
}

export type PromptTemplateFormatInputValues<
  InputVariables extends readonly PromptTemplateInputVariable[],
  InputVariableNameRequired extends
    PromptTemplateInputVariableName = ExtractInputVariableNameRequired<InputVariables>,
  InputVariableNameOptional extends
    PromptTemplateInputVariableName = ExtractInputVariableNameOptional<InputVariables>,
> = [ExtractInputVariableName<InputVariables>] extends [never]
  ? undefined | void
  : Prettify<
      {
        [InputVariableName in InputVariableNameRequired]: PromptTemplateInputValue
      } & {
        [InputVariableName in InputVariableNameOptional]?: PromptTemplateInputValue
      }
    >

export interface PromptTemplateFormatOptions {
  /**
   * @default true
   */
  validateInputValues?: boolean
}

export type PromptTemplateFormat<
  InputVariables extends PromptTemplateInputVariable[],
> = (
  inputValues: PromptTemplateFormatInputValues<InputVariables>,
  options?: PromptTemplateFormatOptions,
) => string

// #####################
// PromptTemplateOptions
// #####################

export interface PromptTemplateOptions {
  /**
   * @default true
   */
  dedent?: boolean
  prefix?: string
  suffix?: string
}

// ####################
// CreatePromptTemplate
// ####################

export type CreatePromptTemplate = <
  T extends PromptTemplateStrings | PromptTemplateOptions,
  InputVariables extends readonly PromptTemplateInputVariable[],
>(
  templateStringsOrOptions: T,
  ...inputVariables: ValidateInputVariables<InputVariables>
) => ExtractCreatePromptTemplateResult<T, InputVariables>

export type ExtractCreatePromptTemplateResult<
  T extends PromptTemplateStrings | PromptTemplateOptions,
  InputVariables extends readonly PromptTemplateInputVariable[],
> = T extends PromptTemplateStrings
  ? PromptTemplate<InputVariables>
  : CreatePromptTemplate

// #############
// Utility Types
// #############

type IfStringLiteral<T, Then, Else> =
  IsStringLiteral<T> extends true ? Then : Else

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
