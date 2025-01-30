# @prompt-template/formatters

`@prompt-template/formatters` provides a collection of formatters for use with [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core). These formatters allow you to customize the formatting of input variables in your prompt templates.

## Installation

```sh
npm i @prompt-template/core @prompt-template/formatters
```

## Usage

```ts
import { PromptTemplate } from '@prompt-template/core'
import { preserveIndent } from '@prompt-template/formatters'

const promptTemplate = PromptTemplate.create`
  foo
    ${{ name: 'input', onFormat: preserveIndent }}
`

const prompt = promptTemplate.format({
  input: ['bar', 'baz'].join('\n'),
})
//=> foo
//     bar
//     baz
```

**Or more concisely**

```ts
const promptTemplate = PromptTemplate.create`
  foo
    ${preserveIndent('input')}
`

const prompt = promptTemplate.format({
  input: ['bar', 'baz'].join('\n'),
})
//=> foo
//     bar
//     baz
```

## API

### `preserveIndent`

A formatter that preserves the indentation of input values spanning multiple lines. The API can be used in two ways:

#### With `onFormat`

```ts
const promptTemplate = PromptTemplate.create`
  foo
    ${{ name: 'input', onFormat: preserveIndent }}
`

const prompt = promptTemplate.format({
  input: ['bar', 'baz'].join('\n'),
})
//=> foo
//     bar
//     baz
```

#### With `PromptTemplateInputVariableName`

```ts
const promptTemplate = PromptTemplate.create`
  foo
    ${preserveIndent('input')}
`

const prompt = promptTemplate.format({
  input: ['bar', 'baz'].join('\n'),
})
//=> foo
//     bar
//     baz
```

### With `PromptTemplateInputVariableConfig` options

```ts
const promptTemplate = PromptTemplate.create`
  foo
    ${preserveIndent('input', { default: 'default' })}
`

const prompt = promptTemplate.format({
  input: ['bar', 'baz'].join('\n'),
})
//=> foo
//     bar
//     baz

const promptWithDefault = promptTemplate.format({})
//=> foo
//     default
```
