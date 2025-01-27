# `@prompt-template`

Monorepo for the core `@prompt-template` modules, types, and adapters.

## Quick start

```sh
npm i @prompt-template/core
```

```js
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${'animal'}.
`

const prompt = promptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 names for a superhero cat.'
```

For detailed usage and API documentation, please refer to the [README in `packages/core`](packages/core/README.md).

## With OpenAI

```sh
npm i @prompt-template/core @prompt-template/openai openai
```

```js
import { PromptTemplate } from '@prompt-template/core'
import { ChatPromptTemplate } from '@prompt-template/openai'
import { OpenAI } from 'openai'

const chatPromptTemplate = ChatPromptTemplate.from([
  {
    role: 'system',
    content: 'You are a friendly assistant.',
  },
  {
    role: 'user',
    promptTemplate: PromptTemplate.create`
      Brainstorm 3 names for a superhero ${'animal'}.
    `,
  },
])

const messages = chatPromptTemplate.format({
  animal: 'cat',
})
//=> [
//     { role: 'system', content: 'You are a friendly assistant.' },
//     { role: 'user', content: 'Brainstorm 3 names for a superhero cat.' }
//   ]

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages,
})

console.log(completion.choices[0]?.message.content)
```

For detailed usage and API documentation, please refer to the [README in `packages/openai`](packages/openai/README.md).
