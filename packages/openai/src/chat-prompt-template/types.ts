/* eslint-disable no-unused-vars */
import type {
  PromptTemplate,
  PromptTemplateFormatInputValuesBase,
  PromptTemplateFormatOptions,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
} from '@prompt-template/core'
import type { ChatCompletionMessageParam } from 'openai/resources/index.js'

import { ChatPromptTemplate } from './chat-prompt-template.js'

// ##################
// ChatPromptTemplate
// ##################

export interface ChatPromptTemplateBase {
  messages: ChatPromptTemplateMessage<PromptTemplateInputVariable[]>[]

  format(
    inputValues?: PromptTemplateFormatInputValuesBase | void,
    options?: PromptTemplateFormatOptions,
  ): ChatCompletionMessageParam[]

  getInputVariables(): PromptTemplateInputVariable[]

  getInputVariableNames(): PromptTemplateInputVariableName[]

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]
}

export type ChatPromptTemplateMessage<
  InputVariables extends PromptTemplateInputVariable[],
> = ChatCompletionMessageParam extends infer ChatCompletionMessage
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

export type ChatPromptTemplateFromMessages = <
  InputVariables extends PromptTemplateInputVariable[],
  Messages extends ChatPromptTemplateMessage<InputVariables>[],
>(
  // eslint-disable-next-line no-unused-vars
  messages: Messages,
) => ChatPromptTemplate<InputVariables, Messages>

// ############################
// PromptTemplateInputVariables
// ############################

type FlattenInputVariables<T> = T extends (infer U)[] ? U : never

export type ExtractInputVariables<
  Messages extends ChatPromptTemplateMessage<PromptTemplateInputVariable[]>[],
> = FlattenInputVariables<
  Messages extends ChatPromptTemplateMessage<infer U>[] ? U : never
>[]
