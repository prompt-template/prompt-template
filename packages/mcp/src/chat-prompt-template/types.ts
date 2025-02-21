/* eslint-disable no-unused-vars */
import type {
  PromptTemplate,
  PromptTemplateFormatInputValuesBase,
  PromptTemplateFormatOptions,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
  PromptTemplateWalkInputVariablesOptions,
} from '@prompt-template/core'
import type {
  PromptMessage,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js'

// ##################
// ChatPromptTemplate
// ##################

export interface ChatPromptTemplateBase {
  readonly messages: readonly ChatPromptTemplateMessage<any>[]

  format(
    inputValues?: PromptTemplateFormatInputValuesBase | undefined | void,
    options?: PromptTemplateFormatOptions | undefined,
  ): PromptMessage[]

  getInputVariables(): PromptTemplateInputVariable[]

  getInputVariableNames(): PromptTemplateInputVariableName[]

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]

  walkInputVariables(options: PromptTemplateWalkInputVariablesOptions): void
}

// Adapted from https://github.com/sindresorhus/type-fest/blob/db3403a4b3d35641baacca7c1f41500a0e889528/source/omit-index-signature.d.ts#L91
type OmitIndexSignatureDeep<T> = {
  [K in keyof T as {} extends Record<K, unknown>
    ? never
    : K]: T[K] extends object ? OmitIndexSignatureDeep<T[K]> : T[K]
}

export type ChatPromptTemplateMessage<
  InputVariables extends readonly PromptTemplateInputVariable[],
> = Prettify<
  OmitIndexSignatureDeep<PromptMessage> extends infer ChatCompletionMessage
    ? ChatCompletionMessage extends { content: infer Content }
      ? Content extends TextContent
        ? Omit<ChatCompletionMessage, 'content'> & {
            content: Omit<Content, 'text'> &
              (
                | {
                    text: TextContent['text']
                    promptTemplate?: never
                  }
                | {
                    text?: never
                    promptTemplate: PromptTemplate<InputVariables>
                  }
              )
          }
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
  ? M extends {
      content: {
        text?: never
        promptTemplate: PromptTemplate<infer InputVariables>
      }
    }
    ? InputVariables
    : never
  : never

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
