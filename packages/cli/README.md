# @prompt-template/cli

> A CLI to inspect and format prompt templates

## Usage

### Commands

| Command  | Description                                              |
| -------- | -------------------------------------------------------- |
| `help`   | Show help for the CLI or a specific prompt template file |
| `format` | Format a prompt template file with provided variables    |

### Format a `PromptTemplate`

Given a file `brainstorm-superhero-names.ts`:

```ts
import { PromptTemplate } from '@prompt-template/core'

export default PromptTemplate.create`
  Brainstorm 3 names for a superhero ${{
    name: 'animal',
    description: 'The animal the superhero is based on',
  }}.
`
```

Run:

```sh
npx @prompt-template/cli format brainstorm-superhero-names.ts --animal cat
#=> Brainstorm 3 names for a superhero cat.
```

### Display help

```sh
npx @prompt-template/cli help
# Usage: @prompt-template/cli <command> <prompt-template-file> [args]
# ...

npx @prompt-template/cli help brainstorm-superhero-names.ts
#=> Input variables:
#     --animal <animal> The animal the superhero is based on
#
#   Example usage:
#     npx @prompt-template/cli brainstorm-superhero-names.ts --animal <animal>
```
