# @prompt-template/to-zod

`@prompt-template/to-zod` provides a utility for converting `PromptTemplate` instances from [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core) into Zod schemas.

## Installation

```sh
npm i @prompt-template/core @prompt-template/to-zod
```

## Usage

```ts
import { PromptTemplate } from '@prompt-template/core'
import { promptTemplateToZod } from '@prompt-template/to-zod'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${'animal'}.
`

const promptTemplateSchema = promptTemplateToZod(promptTemplate)

promptTemplateSchema.parse({
  animal: 'cat',
})
```
