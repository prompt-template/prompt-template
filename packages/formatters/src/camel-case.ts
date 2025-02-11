import type {
  PromptTemplateInputVariableConfig,
  PromptTemplateInputVariableName,
} from '@prompt-template/core'

import { camelCase } from './vendor/change-case.js'
export { camelCase } from './vendor/change-case.js'

type CamelCaseOptions = Parameters<typeof camelCase>[1]

type OnFormat = NonNullable<PromptTemplateInputVariableConfig['onFormat']>

type PromptTemplateInputVariableConfigPartial = Omit<
  PromptTemplateInputVariableConfig,
  'name' | 'onFormat'
>

type WithCamelCaseResult<
  T extends PromptTemplateInputVariableName,
  U extends PromptTemplateInputVariableConfigPartial | undefined = undefined,
> = U extends PromptTemplateInputVariableConfigPartial
  ? { name: T; onFormat: OnFormat } & U
  : { name: T; onFormat: OnFormat }

export function withCamelCase<
  T extends PromptTemplateInputVariableName,
  U extends PromptTemplateInputVariableConfigPartial | undefined = undefined,
>(
  name: T,
  extendedInputVariableConfig?: U & { formatterOptions?: CamelCaseOptions },
): WithCamelCaseResult<T, U> {
  const { formatterOptions, ...inputVariableConfig } =
    extendedInputVariableConfig ?? {}

  return {
    ...inputVariableConfig,
    name,
    onFormat: (inputValue) => camelCase(inputValue, formatterOptions),
  } as WithCamelCaseResult<T, U>
}
