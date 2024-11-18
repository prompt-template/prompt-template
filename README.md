# `@prompt-template`

Monorepo for the core `@prompt-template` modules, types, and integrations.

## Quick start

```sh
npm i @prompt-template/core
```

```js
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create`
  Summarize the following text in ${'length'}:
  ${'text'}
`

const prompt = promptTemplate.format({
  length: 'a few words',
  text: 'A long time ago in a galaxy far, far away...',
})
//=> 'Summarize the following text in a few words:
//    A long time ago in a galaxy far, far away...'
```

For detailed usage and API documentation, please refer to the [README in `packages/core`](packages/core/README.md).
