# @prompt-template/cli

A CLI to inspect and format prompt templates. Provide input variables via CLI flags and pipe formatted prompt templates into code agents, such as Claude or Codex.

## Installation

```sh
npm i @prompt-template/core @prompt-template/cli
```

## Usage

```sh
# Inspect a prompt template
npx @prompt-template/cli inspect <prompt-template-file>

# Format a prompt template
npx @prompt-template/cli format <prompt-template-file> --input <input>

# Pipe a formatted prompt template to a code agent
npx @prompt-template/cli format <prompt-template-file> | claude
```

Need help? Run:

```sh
npx @prompt-template/cli help
```

## Example Workflow

Given the following `summarize-file.ts` prompt template:

```ts
import { PromptTemplate } from '@prompt-template/core'

export default PromptTemplate.create`
  Summarize the contents of ${'filePath'} in bullet points.

  Additional instructions:
  ${{
    name: 'instructions',
    description: 'Additional instructions for summarization',
    default: 'N/A',
  }}
`
```

1. **Inspect the prompt template's input variables:**

```sh
npx @prompt-template/cli inspect summarize-file.ts
#=> Input variables:
#     --filePath <filePath>
#     --instructions <instructions> (optional) Additional instructions for summarization
#
#   Example usage:
#   npx @prompt-template/cli format summarize-file.ts \
#     --filePath <filePath> \
#     --instructions <instructions>
```

2. **Format the prompt template with input values (via CLI flags):**

```sh
npx @prompt-template/cli format summarize-file.ts --filePath /path/to/file.md
#=> Summarize the contents of /path/to/file.md in bullet points.
#
#   Additional instructions:
#   N/A
```

3. **Pipe the formatted prompt template to a code agent (e.g. Claude or Codex):**

```sh
npx @prompt-template/cli format summarize-file.ts --filePath /path/to/file.md | claude
#=> Summary of /path/to/file.md...
```

4. **Pipe the formatted prompt template to multiple code agents:**

```sh
for file in dir/*.md; do
  npx @prompt-template/cli format summarize-file.ts \
    --instructions "Write the summary to an adjacent file suffixed with -summary.md" \
    --filePath "$PWD/$file" | claude -p
done
```

See the [core package](https://github.com/prompt-template/prompt-template/tree/main/packages/core) for more details and API documentation.
