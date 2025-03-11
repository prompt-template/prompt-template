import { PromptTemplate } from '@prompt-template/core'
import { Prompt, PromptArgument } from '@modelcontextprotocol/sdk/types.js'

import { ChatPromptTemplate } from '../chat-prompt-template/chat-prompt-template.js'

export function toPrompt(
  name: Prompt['name'],
  promptTemplate: PromptTemplate<any> | ChatPromptTemplate<any>,
): Prompt {
  const promptArguments: { [inputVariableName: string]: PromptArgument } = {}

  promptTemplate.walkInputVariables({
    strategy: 'breadth-first',
    onInputVariableName: (inputVariableName) => {
      promptArguments[inputVariableName] ??= { name: inputVariableName }

      promptArguments[inputVariableName].required ||= true
    },
    onInputVariableConfig: (inputVariableConfig) => {
      const inputVariableName = inputVariableConfig.name

      promptArguments[inputVariableName] ??= { name: inputVariableName }

      if (
        typeof promptArguments[inputVariableName].description !== 'string' &&
        inputVariableConfig.description
      ) {
        promptArguments[inputVariableName].description =
          inputVariableConfig.description
      }

      if (typeof inputVariableConfig.default === 'string') {
        promptArguments[inputVariableName].required ??= false
      } else {
        promptArguments[inputVariableName].required = true
      }
    },
  })

  return {
    name,
    description: promptTemplate.description,
    arguments: Object.values(promptArguments),
  }
}
