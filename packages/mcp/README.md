# @prompt-template/mcp

`@prompt-template/mcp` provides an adapter for integrating [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core) with the Model Context Protocol Prompts API.

## Installation

```sh
npm i @prompt-template/core @prompt-template/mcp
```

## Usage

```ts
import { PromptTemplate } from '@prompt-template/core'
import { toPrompt } from '@prompt-template/mcp'

const promptTemplate PromptTemplate.create({
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

## API

### `toPrompt`

A function that converts a `PromptTemplate` instance into a Model Context Protocol prompt.

```ts
import { PromptTemplate } from '@prompt-template/core'
import { toPrompt } from '@prompt-template/mcp'

const promptTemplate PromptTemplate.create({
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
