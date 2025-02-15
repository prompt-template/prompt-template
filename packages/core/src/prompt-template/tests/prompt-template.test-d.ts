import { expectTypeOf, test } from 'vitest'
import type { EmptyObject } from 'type-fest'

import { PromptTemplate, PromptTemplateFormat } from '../../index.js'

test('`promptTemplate` with empty string', () => {
  const promptTemplate = PromptTemplate.create``

  type InputVariables = []

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with basic string', () => {
  const promptTemplate = PromptTemplate.create`0`

  type InputVariables = []

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableName`', () => {
  const promptTemplate = PromptTemplate.create`${'a'}`

  type InputVariables = ['a']

  type InputValues = { a: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableConfig`', () => {
  const promptTemplate = PromptTemplate.create`${{ name: 'b' }}`

  type InputVariables = [{ readonly name: 'b' }]

  type InputValues = { b: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableConfig` with default', () => {
  const promptTemplate = PromptTemplate.create`${{
    name: 'b',
    default: 'value',
  }}`

  type InputVariables = [{ readonly name: 'b'; readonly default: 'value' }]

  type InputValues = { b?: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableName` and literal `InputVariableConfig`', () => {
  const promptTemplate = PromptTemplate.create`${'a'}${{ name: 'b' }}`

  type InputVariables = ['a', { readonly name: 'b' }]

  type InputValues = { a: string; b: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableName` and literal `InputVariableConfig` with default', () => {
  const promptTemplate = PromptTemplate.create`${'a'}${{
    name: 'b',
    default: 'value',
  }}`

  type InputVariables = ['a', { readonly name: 'b'; readonly default: 'value' }]

  type InputValues = { a: string; b?: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableName`, literal `InputVariableConfig`, and literal `InputVariableName`', () => {
  const promptTemplate = PromptTemplate.create`${'a'}${{ name: 'b' }}${'c'}`

  type InputVariables = ['a', { readonly name: 'b' }, 'c']

  type InputValues = { a: string; b: string; c: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with literal `InputVariableName`, literal `InputVariableConfig` with default, and literal `InputVariableName`', () => {
  const promptTemplate = PromptTemplate.create`${'a'}${{
    name: 'b',
    default: 'value',
  }}${'c'}`

  type InputVariables = [
    'a',
    { readonly name: 'b'; readonly default: 'value' },
    'c',
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with empty string', () => {
  const promptTemplateNested = PromptTemplate.create``

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[]>]

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with basic string', () => {
  const promptTemplateNested = PromptTemplate.create`0`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[]>]

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableName`', () => {
  const promptTemplateNested = PromptTemplate.create`${'a'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a']>]

  type InputValues = { a: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableConfig`', () => {
  const promptTemplateNested = PromptTemplate.create`${{ name: 'b' }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[{ readonly name: 'b' }]>]

  type InputValues = { b: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableConfig` with default', () => {
  const promptTemplateNested = PromptTemplate.create`${{
    name: 'b',
    default: 'value',
  }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[{ readonly name: 'b'; readonly default: 'value' }]>,
  ]

  type InputValues = { b?: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableName` and literal `InputVariableConfig`', () => {
  const promptTemplateNested = PromptTemplate.create`${'a'}${{ name: 'b' }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a', { readonly name: 'b' }]>]

  type InputValues = { a: string; b: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableName` and literal `InputVariableConfig` with default', () => {
  const promptTemplateNested = PromptTemplate.create`${'a'}${{
    name: 'b',
    default: 'value',
  }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<['a', { readonly name: 'b'; readonly default: 'value' }]>,
  ]

  type InputValues = { a: string; b?: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableName`, literal `InputVariableConfig`, and literal `InputVariableName`', () => {
  const promptTemplateNested = PromptTemplate.create`${'a'}${{ name: 'b' }}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a', { readonly name: 'b' }, 'c']>]

  type InputValues = { a: string; b: string; c: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with nested `promptTemplate` with literal `InputVariableName`, literal `InputVariableConfig` with default, and literal `InputVariableName`', () => {
  const promptTemplateNested = PromptTemplate.create`${'a'}${{
    name: 'b',
    default: 'value',
  }}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<
      ['a', { readonly name: 'b'; readonly default: 'value' }, 'c']
    >,
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with empty string', () => {
  const promptTemplateNestedDeep = PromptTemplate.create``

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<[]>]>]

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with basic string', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`0`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<[]>]>]

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName`', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<['a']>]>]

  type InputValues = { a: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableConfig`', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${{ name: 'b' }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[PromptTemplate<[{ readonly name: 'b' }]>]>,
  ]

  type InputValues = { b: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableConfig` with default', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${{
    name: 'b',
    default: 'value',
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<
      [PromptTemplate<[{ readonly name: 'b'; readonly default: 'value' }]>]
    >,
  ]

  type InputValues = { b?: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName` and literal `InputVariableConfig`', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{ name: 'b' }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[PromptTemplate<['a', { readonly name: 'b' }]>]>,
  ]

  type InputValues = { a: string; b: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName` and literal `InputVariableConfig` with default', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{
    name: 'b',
    default: 'value',
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<
      [PromptTemplate<['a', { readonly name: 'b'; readonly default: 'value' }]>]
    >,
  ]

  type InputValues = { a: string; b?: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName`, literal `InputVariableConfig`, and literal `InputVariableName`', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{ name: 'b' }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[PromptTemplate<['a', { readonly name: 'b' }]>, 'c']>,
  ]

  type InputValues = { a: string; b: string; c: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})

test('`promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName`, literal `InputVariableConfig` with default, and literal `InputVariableName`', () => {
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{
    name: 'b',
    default: 'value',
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<
      [
        PromptTemplate<
          ['a', { readonly name: 'b'; readonly default: 'value' }]
        >,
        'c',
      ]
    >,
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectTypeOf(promptTemplate).toEqualTypeOf<PromptTemplate<InputVariables>>()

  expectTypeOf(promptTemplate.format).toEqualTypeOf<
    PromptTemplateFormat<InputVariables>
  >()

  expectTypeOf(promptTemplate.format).parameter(0).toEqualTypeOf<InputValues>()
})
