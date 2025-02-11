# @prompt-template/formatters

`@prompt-template/formatters` provides a collection of formatters for use with [`@prompt-template/core`](https://github.com/prompt-template/prompt-template/tree/main/packages/core). These formatters allow you to customize the formatting of input variables in your prompt templates.

## Installation

```sh
npm i @prompt-template/core @prompt-template/formatters
```

## Usage

```ts
import { PromptTemplate } from '@prompt-template/core'
import { camelCase } from '@prompt-template/formatters'

const promptTemplate = PromptTemplate.create`
  foo ${{ name: 'input', onFormat: camelCase }}
`

const prompt = promptTemplate.format({
  input: 'bar baz',
})
//=> 'foo barBaz'
```

**Or more concisely**

```ts
import { PromptTemplate } from '@prompt-template/core'
import { withCamelCase } from '@prompt-template/formatters'

const promptTemplate = PromptTemplate.create`
  foo ${withCamelCase('input')}
`

const prompt = promptTemplate.format({
  input: 'bar baz',
})
//=> 'foo barBaz'
```

## API

### `camelCase`

A formatter that converts the input string to camel case.

#### With `onFormat`

```ts
const promptTemplate = PromptTemplate.create`
  foo ${{ name: 'input', onFormat: camelCase }}
`

const prompt = promptTemplate.format({
  input: 'bar baz',
})
//=> 'foo barBaz'
```

#### With `PromptTemplateInputVariableName`

```ts
const promptTemplate = PromptTemplate.create`
  foo ${withCamelCase('input')}
`

const prompt = promptTemplate.format({
  input: 'bar baz',
})
//=> 'foo barBaz'
```

### With `PromptTemplateInputVariableConfig` options

```ts
const promptTemplate = PromptTemplate.create`
  foo ${withCamelCase('input', { default: 'default' })}
`

const prompt = promptTemplate.format({
  input: 'bar baz',
})
//=> 'foo barBaz'

const promptWithDefault = promptTemplate.format({})
//=> 'foo default'
```

### With `formatterOptions`

```ts
const promptTemplate = PromptTemplate.create`
  foo ${withCamelCase('input', { formatterOptions: { delimiter: ' ' } })}
`

const prompt = promptTemplate.format({
  input: 'bar baz',
})
//=> 'foo bar Baz'
```
