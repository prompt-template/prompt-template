# `@prompt-template`

Monorepo for the core `@prompt-template` modules, types, and integrations.

Note: This project is temporarily being developed in the [aaronccasanova/aacc](https://github.com/aaronccasanova/aacc/tree/main/packages/prompt-template-core) repository while similar infrastructure is setup here.

## Quick start

```sh
npm i @prompt-template/core
```

```js
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create`
  Brainstorm creative uses for ${'topic'}.
  Think outside the box and propose unconventional or innovative ideas.
`

const prompt = promptTemplate.format({
  topic: 'AI',
})
//=> 'Brainstorm creative uses for AI.
//    Think outside the box and propose unconventional or innovative ideas.'
```
