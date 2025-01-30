import type {
  PromptTemplateInputVariableConfig,
  PromptTemplateInputVariableName,
} from '@prompt-template/core'

type OnFormat = NonNullable<PromptTemplateInputVariableConfig['onFormat']>
type OnFormatParams = Parameters<OnFormat>
type OnFormatInputValue = OnFormatParams[0]
type OnFormatAccumulatedPrompt = OnFormatParams[1]

type PromptTemplateInputVariableConfigPartial = Omit<
  PromptTemplateInputVariableConfig,
  'name' | 'onFormat'
>

type PreserveIndentResult<
  T extends OnFormatInputValue | PromptTemplateInputVariableName,
  U extends
    | OnFormatAccumulatedPrompt
    | PromptTemplateInputVariableConfigPartial
    | undefined = undefined,
> = U extends OnFormatAccumulatedPrompt
  ? string
  : U extends PromptTemplateInputVariableConfigPartial
    ? { name: T; onFormat: OnFormat } & U
    : { name: T; onFormat: OnFormat }

export function preserveIndent<
  T extends OnFormatInputValue | PromptTemplateInputVariableName,
  U extends
    | OnFormatAccumulatedPrompt
    | PromptTemplateInputVariableConfigPartial
    | undefined = undefined,
>(
  inputValueOrName: T,
  accumulatedPromptOrInputVariableConfig?: U,
): PreserveIndentResult<T, U> {
  // If second argument is a string, assume `onFormat` is being called
  if (typeof accumulatedPromptOrInputVariableConfig === 'string') {
    const inputValue = inputValueOrName
    const accumulatedPrompt = accumulatedPromptOrInputVariableConfig

    return preserveIndentFormatter(
      inputValue,
      accumulatedPrompt,
    ) as PreserveIndentResult<T, U>
  }

  // Otherwise, create a `PromptTemplateInputVariableConfig`
  const name = inputValueOrName
  const inputVariableConfig = accumulatedPromptOrInputVariableConfig

  return {
    ...(inputVariableConfig as PromptTemplateInputVariableConfigPartial),
    name,
    onFormat: preserveIndentFormatter,
  } as PreserveIndentResult<T, U>
}

function preserveIndentFormatter(
  inputValue: OnFormatInputValue,
  accumulatedPrompt: OnFormatAccumulatedPrompt,
): string {
  const lastLineIndent = accumulatedPrompt.split(/\r?\n|\r/).pop() ?? ''

  return inputValue
    .split('\n')
    .map((line, i) => (i === 0 ? line : lastLineIndent + line))
    .join('\n')
}
