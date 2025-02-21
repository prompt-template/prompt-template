import {
  ExtractPromptTemplateInputVariableName,
  ExtractPromptTemplateInputVariableNameOptional,
  ExtractPromptTemplateInputVariableNameRequired,
  PromptTemplate,
  PromptTemplateFormatInputValues,
  PromptTemplateFormatOptions,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
  PromptTemplateWalkInputVariablesOptions,
} from '@prompt-template/core'
import type { CoreMessage } from 'ai'

import {
  ChatPromptTemplateBase,
  ChatPromptTemplateMessage,
  ExtractInputVariables,
} from './types.js'

type ChatPromptTemplateOptions<
  Messages extends readonly ChatPromptTemplateMessage<any>[],
> = {
  description?: string | undefined
  messages: Messages
}

function chatPromptTemplateFromMessages<
  Messages extends readonly ChatPromptTemplateMessage<any>[],
>(messagesOrOptions: Messages | ChatPromptTemplateOptions<Messages>) {
  return new ChatPromptTemplate(
    'messages' in messagesOrOptions
      ? messagesOrOptions
      : { messages: messagesOrOptions },
  )
}

export class ChatPromptTemplate<
  Messages extends readonly ChatPromptTemplateMessage<any>[],
> implements ChatPromptTemplateBase
{
  static from = chatPromptTemplateFromMessages

  readonly messages: Messages

  description?: string | undefined

  constructor(options: ChatPromptTemplateOptions<Messages>) {
    this.messages = options.messages
    this.description = options.description
  }

  format(
    inputValues: PromptTemplateFormatInputValues<
      ExtractInputVariables<Messages>
    >,
    options: PromptTemplateFormatOptions = {
      validateInputValues: true,
    },
  ): CoreMessage[] {
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
    const inputVariables: PromptTemplateInputVariable[] = []

    for (const message of this.messages) {
      if (!('promptTemplate' in message) || !message.promptTemplate) continue

      inputVariables.push(...message.promptTemplate.inputVariables)
    }

    return inputVariables
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

  walkInputVariables(options: PromptTemplateWalkInputVariablesOptions) {
    const inputVariables = this.getInputVariables()

    PromptTemplate.walkInputVariables(inputVariables, options)
  }
}
