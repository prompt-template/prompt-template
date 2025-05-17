import * as util from 'node:util'

import { PromptTemplate } from '@prompt-template/core'

import { parseInputVariables } from './parse-input-variables.js'

export function toParseArgsConfig(
  promptTemplate: PromptTemplate<any>,
): util.ParseArgsConfig {
  const parsedInputVariables = parseInputVariables(promptTemplate)

  return {
    options: Object.fromEntries(
      Object.entries(parsedInputVariables).map(([inputVariableName]) => [
        inputVariableName,
        { type: 'string' },
      ]),
    ),
  }
}
