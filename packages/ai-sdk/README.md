# @prompt-template/ai-sdk

`@prompt-template/ai-sdk` provides an adapter for integrating [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core) with AI SDK APIs. This adapter allows you to define chat prompt templates and formatting them into AI SDK-compliant chat completion messages.

## Installation

```sh
npm i @prompt-template/core @prompt-template/ai-sdk
```

## Usage

```ts
import { PromptTemplate } from '@prompt-template/core'
import { ChatPromptTemplate } from '@prompt-template/ai-sdk'

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
```

## API

### `ChatPromptTemplate.from`

A static method that creates a `ChatPromptTemplate` instance from an array of chat prompt template messages.

```ts
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
```

### `ChatPromptTemplate.format`

A method that formats the `ChatPromptTemplate` instances into AI SDK-compliant chat completion messages.

```ts
const messages = chatPromptTemplate.format({
  animal: 'cat',
})
//=> [
//     { role: 'system', content: 'You are a friendly assistant.' },
//     { role: 'user', content: 'Brainstorm 3 names for a superhero cat.' }
//   ]
```
