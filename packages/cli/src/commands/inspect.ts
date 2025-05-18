import * as path from 'node:path'

import type { PromptTemplate } from '@prompt-template/core'

import { parseInputVariables } from '../utils/parse-input-variables.js'

const promptTemplateFileName = process.argv[2]

if (!promptTemplateFileName) {
  throw new Error('No prompt template file name provided')
}

const promptTemplateFilePath = path.resolve(promptTemplateFileName)

const promptTemplate: PromptTemplate<any> = (
  await import(promptTemplateFilePath)
)?.default

if (!promptTemplate) {
  throw new Error(`No default export found in ${promptTemplateFileName}`)
}

const parsedInputVariables = parseInputVariables(promptTemplate)

if (promptTemplate.description) {
  console.log(`Description: ${promptTemplate.description}`)
}

const inputVariableValues = Object.values(parsedInputVariables)

if (inputVariableValues.length) {
  console.log()
  console.log('Input variables:')

  inputVariableValues.forEach((inputVariableValue) => {
    let inputVariable = `  --${inputVariableValue.name} <${inputVariableValue.name}>`

    if (!inputVariableValue.required) {
      inputVariable += ` (optional)`
    }

    if (inputVariableValue.description) {
      inputVariable += ` ${inputVariableValue.description}`
    }

    console.log(inputVariable)
  })
}

const inputVariableValuesRequired = inputVariableValues.filter(
  (inputVariableValue) => inputVariableValue.required,
)

console.log()
console.log('Example usage:')

let exampleUsage = `npx @prompt-template/cli format ${promptTemplateFileName}`

if (inputVariableValuesRequired.length > 1) {
  inputVariableValuesRequired.forEach((inputVariableValueRequired) => {
    exampleUsage += ` \\\n  --${inputVariableValueRequired.name} <${inputVariableValueRequired.name}>`
  })
} else if (inputVariableValuesRequired[0]) {
  exampleUsage += ` --${inputVariableValuesRequired[0].name} <${inputVariableValuesRequired[0].name}>`
}

console.log()
console.log(exampleUsage)
