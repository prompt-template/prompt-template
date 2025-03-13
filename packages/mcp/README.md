# @prompt-template/mcp

`@prompt-template/mcp` provides an adapter for integrating [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core) with the Model Context Protocol Prompts API.

## Installation

```sh
npm i @prompt-template/core @prompt-template/mcp
```

## Usage

```ts
import { PromptTemplate } from '@prompt-template/core'
import { addPrompt } from '@prompt-template/mcp'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const mcpServer = new McpServer()

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${'animal'}.
`

addPrompt(mcpServer, 'brainstorm-superhero-names', promptTemplate)
```

## API

### `addPrompt`

A function that adds a `PromptTemplate` instance to an MCP server.

```ts
import { PromptTemplate } from '@prompt-template/core'
import { addPrompt } from '@prompt-template/mcp'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const mcpServer = new McpServer()

const promptTemplate = PromptTemplate`
  Brainstorm 3 names for a superhero ${'animal'}.
`

addPrompt(mcpServer, 'brainstorm-superhero-names', promptTemplate)
```

### `ChatPromptTemplate`

A class for creating chat-based prompt templates.

```ts
import { ChatPromptTemplate } from '@prompt-template/mcp'

const chatPromptTemplate = ChatPromptTemplate.from([
  {
    role: 'user',
    content: {
      type: 'text',
      text: 'You are a helpful assistant.',
    },
  },
  {
    role: 'user',
    content: {
      type: 'text',
      promptTemplate: PromptTemplate.create`
        Brainstorm 3 names for a superhero ${'animal'}.
      `,
    },
  },
])

const messages = chatPromptTemplate.format({
  animal: 'cat',
})
//=> [
//     {
//       role: 'user',
//       content: {
//         type: 'text',
//         text: 'You are a helpful assistant.',
//       },
//     },
//     {
//       role: 'user',
//       content: {
//         type: 'text',
//         text: 'Brainstorm 3 names for a superhero cat.',
//       },
//     },
//   ]
```

### `toPrompt`

A function that converts a `PromptTemplate` instance into a format that the low-level `server.setRequestHandler(ListPromptsRequestSchema, callback)` expects.

```ts
import { PromptTemplate } from '@prompt-template/core'
import { toPrompt } from '@prompt-template/mcp'

const promptTemplate = PromptTemplate.create({
  description: 'Brainstorm superhero names for an animal.',
})`
  Brainstorm 3 names for a superhero ${{
    name: 'animal',
    description: 'The animal to name the superhero after.',
  }}.
`

const prompt = toPrompt('brainstorm-superhero-names', promptTemplate)
//=> {
//     name: 'brainstorm-superhero-names',
//     description: 'Brainstorm superhero names for an animal.',
//     arguments: [
//       {
//         name: 'animal',
//         description: 'The animal to name the superhero after.',
//         required: true,
//       },
//     ],
//   }
```
