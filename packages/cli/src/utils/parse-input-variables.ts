import type { PromptTemplate } from '@prompt-template/core'

export interface ParsedInputVariables {
  [inputVariableName: string]: {
    name: string
    description?: string | undefined
    required?: boolean | undefined
  }
}

export function parseInputVariables(
  promptTemplate: PromptTemplate<any>,
): ParsedInputVariables {
  const parsedInputVariables: ParsedInputVariables = {}

  promptTemplate.walkInputVariables({
    strategy: 'breadth-first',
    onInputVariableName: (inputVariableName) => {
      parsedInputVariables[inputVariableName] ??= { name: inputVariableName }

      parsedInputVariables[inputVariableName].required ||= true
    },
    onInputVariableConfig: (inputVariableConfig) => {
      const inputVariableName = inputVariableConfig.name

      parsedInputVariables[inputVariableName] ??= { name: inputVariableName }

      if (
        typeof parsedInputVariables[inputVariableName].description !==
          'string' &&
        inputVariableConfig.description
      ) {
        parsedInputVariables[inputVariableName].description =
          inputVariableConfig.description
      }

      if (typeof inputVariableConfig.default === 'string') {
        parsedInputVariables[inputVariableName].required ??= false
      } else {
        parsedInputVariables[inputVariableName].required = true
      }
    },
  })

  return parsedInputVariables
}
