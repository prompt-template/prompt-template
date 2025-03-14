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
import type { PromptMessage } from '@modelcontextprotocol/sdk/types.js'

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
  ): PromptMessage[] {
    return this.messages.map((message): PromptMessage => {
      let content = message.content

      if (content.type === 'text' && content.promptTemplate) {
        const { promptTemplate, ...restContent } = content

        content = {
          ...restContent,
          text: promptTemplate.format(inputValues, options),
        }
      }

      return {
        ...message,
        content,
      }
    })
  }

  getInputVariables(): PromptTemplateInputVariable[] {
    const inputVariables: PromptTemplateInputVariable[] = []

    for (const message of this.messages) {
      const content = message.content

      if (!('promptTemplate' in content) || !content.promptTemplate) continue

      inputVariables.push(...content.promptTemplate.inputVariables)
    }

    return inputVariables
  }

  getInputVariableNames(): ExtractPromptTemplateInputVariableName<
    ExtractInputVariables<Messages>
  >[] {
    const inputVariableNamesSet = new Set<PromptTemplateInputVariableName>()

    for (const message of this.messages) {
      const content = message.content

      if (!('promptTemplate' in content) || !content.promptTemplate) continue

      for (const inputVariableName of content.promptTemplate.getInputVariableNames()) {
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
      const content = message.content

      if (!('promptTemplate' in content) || !content.promptTemplate) continue

      for (const inputVariableName of content.promptTemplate.getInputVariableNamesRequired()) {
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
    const inputVariableNamesRequiredSet =
      new Set<PromptTemplateInputVariableName>()

    const inputVariableNamesOptionalAllSet =
      new Set<PromptTemplateInputVariableName>()

    for (const message of this.messages) {
      const content = message.content

      if (!('promptTemplate' in content) || !content.promptTemplate) continue

      for (const inputVariableNameRequired of content.promptTemplate.getInputVariableNamesRequired()) {
        inputVariableNamesRequiredSet.add(inputVariableNameRequired)
      }

      for (const inputVariableNameOptional of content.promptTemplate.getInputVariableNamesOptional()) {
        inputVariableNamesOptionalAllSet.add(inputVariableNameOptional)
      }
    }

    const inputVariableNamesOptional: PromptTemplateInputVariableName[] = []

    for (const inputVariableNameOptionalAll of inputVariableNamesOptionalAllSet) {
      if (!inputVariableNamesRequiredSet.has(inputVariableNameOptionalAll)) {
        inputVariableNamesOptional.push(inputVariableNameOptionalAll)
      }
    }

    return inputVariableNamesOptional as ExtractPromptTemplateInputVariableName<
      ExtractInputVariables<Messages>
    >[]
  }

  walkInputVariables(options: PromptTemplateWalkInputVariablesOptions) {
    const inputVariables = this.getInputVariables()

    PromptTemplate.walkInputVariables(inputVariables, options)
  }
}
