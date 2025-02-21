/* eslint-disable no-unused-vars */
import type {
  PromptTemplate,
  PromptTemplateFormatInputValuesBase,
  PromptTemplateFormatOptions,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
  PromptTemplateWalkInputVariablesOptions,
} from '@prompt-template/core'
import type { ChatCompletionMessageParam } from 'openai/resources/index.js'

// ##################
// ChatPromptTemplate
// ##################

export interface ChatPromptTemplateBase {
  readonly messages: readonly ChatPromptTemplateMessage<any>[]

  format(
    inputValues?: PromptTemplateFormatInputValuesBase | undefined | void,
    options?: PromptTemplateFormatOptions | undefined,
  ): ChatCompletionMessageParam[]

  getInputVariables(): PromptTemplateInputVariable[]

  getInputVariableNames(): PromptTemplateInputVariableName[]

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]

  walkInputVariables(options: PromptTemplateWalkInputVariablesOptions): void
}

export type ChatPromptTemplateMessage<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = Prettify<
  ChatCompletionMessageParam extends infer ChatCompletionMessage
    ? ChatCompletionMessage extends { content: infer Content }
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
