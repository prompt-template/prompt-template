# @prompt-template/core

`@prompt-template/core` contains the core `PromptTemplate` module and types for
creating and formatting prompts with input variables. Key features include:

- **Type Safety:** Ensures `PromptTemplate` input variables are defined and
  formatted correctly at compile time.
- **Modular Design:** Supports nested `PromptTemplate`s to promote organization
  and reusability.
- **Intuitive Authoring:** Simplifies prompt creation by solely defining input
  variables in `PromptTemplate`s.
- **Community Prompts:** Designed with the vision of creating and sharing
  `PromptTemplate`s with the community (as NPM packages for example).

## Installation

```sh
npm i @prompt-template/core
```

## Usage

### [`PromptTemplate.create`](#prompttemplatecreate) with [`InputVariableName`](#inputvariablename)

```ts
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${'animal'}.
`

const prompt = promptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 names for a superhero cat.'
```

### [`PromptTemplate.create`](#prompttemplatecreate) with [`InputVariableConfig.onFormat`](#inputvariableconfigonformat)

```ts
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${{
    name: 'animal' as const,
    onFormat: (inputValue) => inputValue.toUpperCase(),
  }}.
`

const prompt = promptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 names for a superhero CAT.'
```

### [`PromptTemplate.create`](#prompttemplatecreate) with [`InputVariableConfig.schema`](#inputvariableconfigschema)

```ts
import { PromptTemplate } from '@prompt-template/core'
import { z } from 'zod'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${{
    name: 'animal' as const,
    schema: z.string().nonempty(),
  }}.
`

const prompt = promptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 names for a superhero cat.'
```

### [`PromptTemplate.create`](#prompttemplatecreate) with [`InputVariableConfig.default`](#inputvariableconfigdefault)

```ts
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${{
    name: 'animal' as const,
    default: 'cat',
  }}.
`

const catPrompt = promptTemplate.format({})
//=> 'Brainstorm 3 names for a superhero cat.'

const dogPrompt = promptTemplate.format({
  animal: 'dog',
})
//=> 'Brainstorm 3 names for a superhero dog.'
```

### [`PromptTemplate.create`](#prompttemplatecreate) with nested [`PromptTemplate.create`](#prompttemplatecreate)

```ts
import { PromptTemplate } from '@prompt-template/core'

const outputFormatPromptTemplate = PromptTemplate.create`
  Format the output as ${{
    name: 'format' as const,
    default: 'bullet points',
  }}.
`

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${'animal'}.
  ${outputFormatPromptTemplate}
`

const bulletPointsPrompt = promptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 names for a superhero cat.
//    Format the output as bullet points.'

const numberedListPrompt = promptTemplate.format({
  animal: 'cat',
  format: 'a numbered list',
})
//=> 'Brainstorm 3 names for a superhero cat.
//    Format the output as a numbered list.'
```

### [`PromptTemplate.create`](#prompttemplatecreate) with [`PromptTemplateOptions`](#prompttemplateoptions)

```ts
import { PromptTemplate } from '@prompt-template/core'

const promptTemplate = PromptTemplate.create({ prefix: 'user: ' })`
  Brainstorm 3 names for a superhero ${'animal'}.
`

const prompt = promptTemplate.format({
  animal: 'cat',
})
//=> 'user: Brainstorm 3 names for a superhero cat.'
```

> Note: By default, [`format`](#formatinputvalues) will `dedent` the formatted
> prompt. You can disable this behavior by setting the `dedent` option to
> `false`.

## API

### `PromptTemplate.create`

A tagged template literal function that returns a
[`PromptTemplate`](#prompttemplate-class) instance or a new `PromptTemplate`
bound to the provided [`PromptTemplateOptions`](#prompttemplateoptions)
overrides.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${'inputVariableName'}.
`

const prompt = promptTemplate.format({
  inputVariableName: 'inputVariableValue' as const,
})
//=> 'My prompt template with inputVariableValue.'
```

or

```ts
const promptTemplate = PromptTemplate.create({ prefix: 'user: ' })`
  My prompt template with ${'inputVariableName'}.
`

const prompt = promptTemplate.format({
  inputVariableName: 'inputVariableValue' as const,
})
//=> 'user: My prompt template with inputVariableValue.'
```

### `PromptTemplate.from(string)`

A static method that returns a [`PromptTemplate`](#prompttemplate-class) instance.

```ts
const promptTemplate = PromptTemplate.from('My prompt template.')

const prompt = promptTemplate.format()
//=> 'My prompt template.'
```

### `PromptTemplate` Class

A `PromptTemplate` instance is returned from a
[`PromptTemplate.create`](#prompttemplatecreate) call. It contains a
[`format`](#formatinputvalues) method for creating the final prompt and
additional properties/methods for advanced use cases.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${'inputVariableName'} and default ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
  }}.
`

promptTemplate.templateStrings
//=> ['My prompt template with ', ' and default ', '.']

promptTemplate.inputVariables
//=> ['inputVariableName', { name: 'inputVariableConfigName' as const, default: 'inputVariableConfigDefault' }]

const prompt = promptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue and default inputVariableConfigDefault.'
```

### `format(inputValues)`

A [`PromptTemplate`](#prompttemplate-class) instance method used to create the
final prompt. It accepts an `inputValues` object where each key corresponds to
the [`InputVariableName`](#inputvariablename),
[`InputVariableConfig.name`](#inputvariableconfig), and any nested
`PromptTemplate` instance input variable names.

```ts
const nestedPromptTemplate = PromptTemplate.create`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const promptTemplate = PromptTemplate.create`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
  }}.
  - ${nestedPromptTemplate}
`

const inputValues = {
  inputVariableName: 'inputVariableValue' as const,
  // inputVariableConfigName: 'inputVariableConfigValue' as const, // Optional
  nestedInputVariableName: 'nestedInputVariableValue' as const,
}

const prompt = promptTemplate.format(inputValues)
//=> '- My prompt template with inputVariableValue
//    - My prompt template with inputVariableConfigDefault
//    - My nested prompt template with nestedInputVariableValue.'
```

### `getInputVariableNames()`

A [`PromptTemplate`](#prompttemplate-class) instance method that recursively
extracts and deduplicates all input variable names.

```ts
const nestedPromptTemplate = PromptTemplate.create`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const promptTemplate = PromptTemplate.create`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
  }}.
  - ${nestedPromptTemplate}
`

promptTemplate.getInputVariableNames()
//=> ['inputVariableName', 'inputVariableConfigName', 'nestedInputVariableName']
```

### `getInputVariableNamesRequired()`

A [`PromptTemplate`](#prompttemplate-class) instance method that recursively
extracts and deduplicates all required input variable names.

```ts
const nestedPromptTemplate = PromptTemplate.create`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const promptTemplate = PromptTemplate.create`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
  }}.
  - ${nestedPromptTemplate}
`

promptTemplate.getInputVariableNamesRequired()
//=> ['inputVariableName', 'nestedInputVariableName']
```

### `getInputVariableNamesOptional()`

A [`PromptTemplate`](#prompttemplate-class) instance method that recursively
extracts and deduplicates all optional input variable names.

```ts
const nestedPromptTemplate = PromptTemplate.create`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const promptTemplate = PromptTemplate.create`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
  }}.
  - ${nestedPromptTemplate}
`

promptTemplate.getInputVariableNamesOptional()
//=> ['inputVariableConfigName']
```

> Important: If input variable names are duplicated and one is required and the
> other is optional, the input variable name is considered required.

```ts
const promptTemplate = PromptTemplate.create`
  My duplicate prompt template with ${'duplicateInputVariableName'} and ${{
    name: 'duplicateInputVariableName' as const,
    default: 'duplicateInputVariableNameDefault',
  }}.
`

promptTemplate.getInputVariableNamesRequired()
//=> ['duplicateInputVariableName']

promptTemplate.getInputVariableNamesOptional()
//=> []
```

### `PromptTemplateOptions`

A `PromptTemplateOptions` object is passed to a
[`PromptTemplate.create`](#prompttemplatecreate) call to override the default behavior of a
[`PromptTemplate`](#prompttemplate-class) instance.

```ts
const promptTemplateOptions = {
  prefix: 'prefix - ',
  suffix: ' - suffix',
  dedent: true, // Default
}

const promptTemplate = PromptTemplate.create(promptTemplateOptions)`
  My prompt template with ${'inputVariableName'}.
`

const prompt = promptTemplate.format({
  inputVariableName: 'inputVariableValue' as const,
})
//=> 'prefix - My prompt template with inputVariableValue. - suffix'
```

### `InputVariableName`

An `InputVariableName` is a string used to identify input variables in a
[`PromptTemplate.create`](#prompttemplatecreate) and establish a corresponding property in
the [`format`](#formatinputvalues) `inputValues`.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${'inputVariableName'}.
`

const prompt = promptTemplate.format({
  inputVariableName: 'inputVariableValue' as const,
})
//=> 'My prompt template with inputVariableValue.'
```

### `InputVariableConfig`

An `InputVariableConfig` is an object used to identify input variables in a
[`PromptTemplate.create`](#prompttemplatecreate) and establish a corresponding property in
the [`format`](#formatinputvalues) `inputValues`. It also allows for additional
configuration of the input variable.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
    onFormat: (inputValue) => inputValue.toUpperCase(),
    schema: z.string().nonempty(),
  }}.
`

const prompt = promptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue' as const,
})
//=> 'My prompt template with INPUTVARIABLECONFIGVALUE.'
```

### `InputVariableConfig.name`

An `InputVariableConfig.name` is a string used to identify input variables in a
[`PromptTemplate.create`](#prompttemplatecreate) and establish a corresponding property in
the [`format`](#formatinputvalues) input values.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${{ name: 'inputVariableConfigName' as const }}.
`

const prompt = promptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue' as const,
})
//=> 'My prompt template with inputVariableConfigValue.'
```

### `InputVariableConfig.default`

An `InputVariableConfig.default` is a default value for an input variable in a
[`PromptTemplate.create`](#prompttemplatecreate) and allows the corresponding property in the
[`format`](#formatinputvalues) `inputValues` to be omitted.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    default: 'inputVariableConfigDefault',
  }}.
`

const prompt = promptTemplate.format({})
//=> 'My prompt template with inputVariableConfigDefault.'
```

### `InputVariableConfig.onFormat`

The `InputVariableConfig.onFormat` function is a callback used to provide custom
formatting for `inputValues` and is called when the
[`format`](#formatinputvalues) method is called.

Arguments:

- `inputValue`: The input variable value passed to the `format` method.
- `accumulatedPrompt`: The accumulated prompt string up to the current position.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    onFormat: (inputValue, accumulatedPrompt) => inputValue.toUpperCase(),
  }}.
`

const prompt = promptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue' as const,
})
//=> 'My prompt template with INPUTVARIABLECONFIGVALUE.'
```

### `InputVariableConfig.schema`

The `InputVariableConfig.schema` property accepts a Zod-like schema and is used
to validate [`format`](#formatinputvalues) `inputValues`.

```ts
const promptTemplate = PromptTemplate.create`
  My prompt template with ${{
    name: 'inputVariableConfigName' as const,
    schema: z.string().nonempty(),
  }}.
`

const prompt = promptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue' as const,
})
//=> 'My prompt template with inputVariableConfigValue.'
```
