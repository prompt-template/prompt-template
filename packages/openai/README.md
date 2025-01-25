# @prompt-template/openai

`@prompt-template/openai` provides an adapter for integrating [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core) with OpenAI's chat completion API. This adapter allows you to define chat prompt templates and formatting them into OpenAI-compliant chat completion messages.

## Installation

```sh
npm i @prompt-template/core @prompt-template/openai
```

## Usage

```ts
import { ChatPromptTemplate, PromptTemplate } from '@prompt-template/openai'

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

A method that formats the `ChatPromptTemplate` instances into OpenAI-compliant chat completion messages.

```ts
const messages = chatPromptTemplate.format({
  animal: 'cat',
})
//=> [
//     { role: 'system', content: 'You are a friendly assistant.' },
//     { role: 'user', content: 'Brainstorm 3 names for a superhero cat.' }
//   ]
```
