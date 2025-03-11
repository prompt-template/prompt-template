/* eslint-disable no-unused-vars */
import {
  PromptTemplate,
  PromptTemplateInputVariableName,
  PromptTemplateWalkInputVariablesOptions,
} from '@prompt-template/core'

import { z } from 'zod'

interface PromptTemplateShape {
  description?: string | undefined

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]

  walkInputVariables(options: PromptTemplateWalkInputVariablesOptions): void
}

type PromptTemplateToZodResult<T extends PromptTemplateShape> = z.ZodObject<
  {
    [InputVariableNameRequired in ReturnType<
      T['getInputVariableNamesRequired']
    >[number]]: z.ZodString
  } & {
    [InputVariableNameOptional in ReturnType<
      T['getInputVariableNamesOptional']
    >[number]]: z.ZodOptional<z.ZodString>
  }
>

export function promptTemplateToZod<T extends PromptTemplateShape>(
  promptTemplate: T,
): PromptTemplateToZodResult<T> {
  const inputVariablesInfo: {
    [inputVariableName: string]: {
      description?: string
      required?: boolean
    }
  } = {}

  promptTemplate.walkInputVariables({
    strategy: 'breadth-first',
    onInputVariableName: (inputVariableName) => {
      inputVariablesInfo[inputVariableName] ??= {}
      inputVariablesInfo[inputVariableName].required ||= true
    },
    onInputVariableConfig: (inputVariableConfig) => {
      const inputVariableName = inputVariableConfig.name

      inputVariablesInfo[inputVariableName] ??= {}

      if (
        typeof inputVariablesInfo[inputVariableName].description !== 'string' &&
        inputVariableConfig.description
      ) {
        inputVariablesInfo[inputVariableName].description =
          inputVariableConfig.description
      }

      if (typeof inputVariableConfig.default === 'string') {
        inputVariablesInfo[inputVariableName].required ??= false
      } else {
        inputVariablesInfo[inputVariableName].required = true
      }
    },
  })

  const promptTemplateSchemaShape: z.ZodRawShape = {}

  for (const [inputVariableName, inputVariableInfo] of Object.entries(
    inputVariablesInfo,
  )) {
    let inputVariableSchema: z.ZodType = z.string()

    if (!inputVariableInfo.required) {
      inputVariableSchema = inputVariableSchema.optional()
    }

    if (inputVariableInfo.description) {
      inputVariableSchema = inputVariableSchema.describe(
        inputVariableInfo.description,
      )
    }

    promptTemplateSchemaShape[inputVariableName] = inputVariableSchema
  }

  let promptTemplateSchema = z.object(promptTemplateSchemaShape)

  if (promptTemplate.description) {
    promptTemplateSchema = promptTemplateSchema.describe(
      promptTemplate.description,
    )
  }

  return promptTemplateSchema as PromptTemplateToZodResult<T>
}
