/* eslint-disable no-unused-vars */
import type {
  PromptTemplate,
  PromptTemplateFormatInputValuesBase,
  PromptTemplateFormatOptions,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
  PromptTemplateWalkInputVariablesOptions,
} from '@prompt-template/core'
import type { CoreMessage } from 'ai'

// ##################
// ChatPromptTemplate
// ##################

export interface ChatPromptTemplateBase {
  readonly messages: readonly ChatPromptTemplateMessage<any>[]

  description?: string | undefined

  format(
    inputValues?: PromptTemplateFormatInputValuesBase | undefined | void,
    options?: PromptTemplateFormatOptions | undefined,
  ): CoreMessage[]

  getInputVariables(): PromptTemplateInputVariable[]

  getInputVariableNames(): PromptTemplateInputVariableName[]

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]

  walkInputVariables(options: PromptTemplateWalkInputVariablesOptions): void
}

export type ChatPromptTemplateMessage<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = Prettify<
  CoreMessage extends infer ChatCompletionMessage
    ? ChatCompletionMessage extends { content: infer Content }
      ? Content extends string
        ? Omit<ChatCompletionMessage, 'content'> &
            (
              | {
                  content: Content
                  promptTemplate?: never
                }
              | {
                  content?: never
                  promptTemplate: PromptTemplate<InputVariables>
                }
            )
        : ChatCompletionMessage
      : never
    : never
>

// ############################
// PromptTemplateInputVariables
// ############################

export type ExtractInputVariables<
  Messages extends readonly ChatPromptTemplateMessage<any>[],
> = Messages[number] extends infer M
  ? M extends { promptTemplate: PromptTemplate<any> }
    ? M extends { promptTemplate: PromptTemplate<infer InputVariables> }
      ? InputVariables
      : never
    : never
  : never

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
