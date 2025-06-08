import * as util from 'node:util'
import * as path from 'node:path'

import { toParseArgsConfig } from '../utils/to-parse-args-config.js'
import { requirePromptTemplate } from '../utils/require-prompt-template.js'

const promptTemplateFileName = process.argv[2]

if (!promptTemplateFileName) {
  throw new Error('No prompt template file provided')
}

const promptTemplateFilePath = path.resolve(promptTemplateFileName)

const promptTemplate = requirePromptTemplate(
  promptTemplateFilePath,
  import.meta,
)

const parseArgsConfig = toParseArgsConfig(promptTemplate)

parseArgsConfig.args = process.argv.slice(3)

const args = util.parseArgs(parseArgsConfig)

const prompt = promptTemplate.format(args.values)

console.log(prompt)
