import * as fs from 'node:fs'
import * as path from 'node:path'
import * as util from 'node:util'

import { generateName } from '../utils/generate-name.js'

const defaultExt = 'ts'

const args = util.parseArgs({
  options: {
    name: { type: 'string', short: 'n' },
    ext: { type: 'string', short: 'e' },
    'out-dir': { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
})

if (args.values.help) {
  console.log(
    `
Usage: npx @prompt-template/cli create [options]

Scaffolds a new prompt template file.

Options:
  -n, --name <name>      The base name of the file (default: Randomly generated e.g. ${generateName()})
  -e, --ext <extension>  The file extension (ts, js, mjs, cjs; default: "${defaultExt}")
  --out-dir <directory>  The output directory (default: process.cwd())
  -h, --help             Display help text
`.trim(),
  )
  process.exit(0)
}

const baseName = args.values.name || generateName()
const extension = args.values.ext || defaultExt
const outDir = args.values['out-dir'] || '.'

const cwd = process.cwd()
const fileName = `${baseName}.${extension}`
const outDirPath = path.resolve(cwd, outDir)
const filePath = path.join(outDirPath, fileName)
const fileNameFromCWD = filePath.replace(cwd + path.sep, '')

await fs.promises.mkdir(outDirPath, { recursive: true }).catch(() => {})

if (fs.existsSync(filePath)) {
  console.error(`Error: File '${filePath}' already exists`)
  process.exit(1)
}

const fileContent = `/**
Usage commands
  # Inspect the prompt template
  npx @prompt-template/cli inspect ${fileNameFromCWD}

  # Format the prompt template
  npx @prompt-template/cli format ${fileNameFromCWD}

  # Pipe into your agent of choice
  npx @prompt-template/cli format ${fileNameFromCWD} | example-agent

@prompt-template/core cheatsheet
  - Declare input variables inline with tagged-template syntax:
    - \${'animal'} // simple named
    - \${{ name: 'animal', schema: z.string(), onFormat: (inputValue) => inputValue, default }} // with name and configs
    - \${promptTemplate} // nested PromptTemplate instance
    - All (nested) input variables are collected, deduplicated, and transformed to:
      - Strongly-typed params for promptTemplate.format(inputValues), and
      - CLI flags when used with @prompt-template/cli (e.g. \${'animal'} becomes --animal <input-value>).
  - TypeScript infers the shape of \`.format(inputValues)\`, while the raw input variables \`expressions[]\` array from the tag enables runtime validation and transforms (schema, onFormat, default, etc.).
*/
import { PromptTemplate } from '@prompt-template/core';

export default PromptTemplate.create/* md */\`
# Instructions

(Provide clear and concise instructions for the agent)

## Objective

(State the primary goal or task for the agent)

## Output Format

(Specify the desired format for the agent's response, e.g. JSON, Markdown, List, etc.)

(Add sections like Context, Examples, or Constraints as needed)
\`
`

await fs.promises.writeFile(filePath, fileContent)

const gray = '\x1b[90m'
const blue = '\x1b[34m'
const reset = '\x1b[0m'

console.log(
  [
    '',
    `✅ Prompt template created at ${blue}${fileNameFromCWD}${reset}`,
    '',
    `Example usage:`,
    `${gray}# Inspect prompt template${reset}`,
    `npx @prompt-template/cli inspect ${fileNameFromCWD}`,
    '',
    `${gray}# Format prompt template${reset}`,
    `npx @prompt-template/cli format ${fileNameFromCWD}`,
    '',
  ].join('\n'),
)
