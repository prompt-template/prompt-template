import type { PromptTemplate } from '@prompt-template/core'
import { require } from 'tsx/cjs/api'

export function requirePromptTemplate(
  promptTemplateFilePath: string,
  importMeta: ImportMeta,
): PromptTemplate<any> {
  const promptTemplateModule = require(promptTemplateFilePath, importMeta.url)

  const promptTemplate = promptTemplateModule?.default || promptTemplateModule

  if (
    !(
      typeof promptTemplate === 'object' &&
      promptTemplate !== null &&
      'templateStrings' in promptTemplate &&
      'inputVariables' in promptTemplate
    )
  ) {
    throw new Error(
      `Invalid prompt template file. Expected \`export default PromptTemplate.create\` in '${promptTemplateFilePath}'`,
    )
  }

  return promptTemplate
}
