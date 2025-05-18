import * as util from 'node:util'
import * as path from 'node:path'

import { toParseArgsConfig } from '../utils/to-parse-args-config.js'

const promptTemplateFileName = process.argv[2]

if (!promptTemplateFileName) {
  throw new Error('No prompt template file provided')
}

const promptTemplateFilePath = path.resolve(promptTemplateFileName)

const promptTemplate = (await import(promptTemplateFilePath))?.default

if (!promptTemplate) {
  throw new Error(
    `No default export prompt template found in ${promptTemplateFileName}`,
  )
}

const parseArgsConfig = toParseArgsConfig(promptTemplate)

parseArgsConfig.args = process.argv.slice(3)

const args = util.parseArgs(parseArgsConfig)

const prompt = promptTemplate.format(args.values)

console.log(prompt)
