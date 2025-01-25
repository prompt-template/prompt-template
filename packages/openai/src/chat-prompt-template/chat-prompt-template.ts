import {
  PromptTemplateFormatInputValues,
  PromptTemplateFormatOptions,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
  ExtractPromptTemplateInputVariableName,
  ExtractPromptTemplateInputVariableNameRequired,
  ExtractPromptTemplateInputVariableNameOptional,
} from '@prompt-template/core'
import type { ChatCompletionMessageParam } from 'openai/resources/index.js'

import {
  ChatPromptTemplateBase,
  ChatPromptTemplateFromMessages,
  ChatPromptTemplateMessage,
  ExtractInputVariables,
} from './types.js'

const chatPromptTemplateFromMessages: ChatPromptTemplateFromMessages = (
  messages,
) => new ChatPromptTemplate(messages)

export class ChatPromptTemplate<
  InputVariables extends PromptTemplateInputVariable[],
  Messages extends ChatPromptTemplateMessage<InputVariables>[],
> implements ChatPromptTemplateBase
{
  static from = chatPromptTemplateFromMessages

  messages: Messages

  constructor(messages: Messages) {
    this.messages = messages
  }

  format(
    inputValues: PromptTemplateFormatInputValues<
      ExtractInputVariables<Messages>
    >,
    options: PromptTemplateFormatOptions = {
      validateInputValues: true,
    },
  ): ChatCompletionMessageParam[] {
    return this.messages.map((message) => {
      if ('promptTemplate' in message && message.promptTemplate) {
        const { promptTemplate, ...restMessage } = message

        return {
          ...restMessage,
          content: promptTemplate.format(inputValues, options),
        }
      }
      return message
    })
  }

  getInputVariables(): PromptTemplateInputVariable[] {
    const inputVariablesSet = new Set<PromptTemplateInputVariable>()

    for (const message of this.messages) {
      if (!('promptTemplate' in message) || !message.promptTemplate) continue

      for (const inputVariable of message.promptTemplate.inputVariables) {
        inputVariablesSet.add(inputVariable)
      }
    }

    return Array.from(inputVariablesSet)
  }

  getInputVariableNames(): ExtractPromptTemplateInputVariableName<
    ExtractInputVariables<Messages>
  >[] {
    const inputVariableNamesSet = new Set<PromptTemplateInputVariableName>()

    for (const message of this.messages) {
      if (!('promptTemplate' in message) || !message.promptTemplate) continue

      for (const inputVariableName of message.promptTemplate.getInputVariableNames()) {
        inputVariableNamesSet.add(inputVariableName)
      }
    }

    const inputVariableNames = Array.from(inputVariableNamesSet)

    return inputVariableNames as ExtractPromptTemplateInputVariableName<
      ExtractInputVariables<Messages>
    >[]
  }

  getInputVariableNamesRequired(): ExtractPromptTemplateInputVariableNameRequired<
    ExtractInputVariables<Messages>
  >[] {
    const inputVariableNamesRequiredSet =
      new Set<PromptTemplateInputVariableName>()

    for (const message of this.messages) {
      if (!('promptTemplate' in message) || !message.promptTemplate) continue

      for (const inputVariableName of message.promptTemplate.getInputVariableNamesRequired()) {
        inputVariableNamesRequiredSet.add(inputVariableName)
      }
    }

    const inputVariableNamesRequired = Array.from(inputVariableNamesRequiredSet)

    return inputVariableNamesRequired as ExtractPromptTemplateInputVariableName<
      ExtractInputVariables<Messages>
    >[]
  }

  getInputVariableNamesOptional(): ExtractPromptTemplateInputVariableNameOptional<
    ExtractInputVariables<Messages>
  >[] {
    const inputVariableNamesOptionalSet =
      new Set<PromptTemplateInputVariableName>()

    for (const message of this.messages) {
      if (!('promptTemplate' in message) || !message.promptTemplate) continue

      for (const inputVariableName of message.promptTemplate.getInputVariableNamesOptional()) {
        inputVariableNamesOptionalSet.add(inputVariableName)
      }
    }

    const inputVariableNamesOptional = Array.from(inputVariableNamesOptionalSet)

    return inputVariableNamesOptional as ExtractPromptTemplateInputVariableName<
      ExtractInputVariables<Messages>
    >[]
  }
}