import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  PromptTemplate,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
} from '@prompt-template/core'

import { ChatPromptTemplate } from '../chat-prompt-template.js'
import { ChatPromptTemplateBase } from '../types.js'

describe('chatPromptTemplate', () => {
  it('handles empty messages', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles basic string', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        content: '0',
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      { role: 'system', promptTemplate: PromptTemplate.create`${'a'}` },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a'],
      inputVariableNames: ['a'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableConfig`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${{ name: 'b' as const }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [{ name: 'b' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${{
          name: 'b' as const,
          default: 'default',
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({ b: 'b' })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'b',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({})

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'default',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [{ name: 'b' as const, default: 'default' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${{
          name: 'b' as const,
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    // const chatPromptTemplate = ChatPromptTemplate.from`${'a'} ${{
    //   name: 'b' as const,
    //   default: 'default',
    // }}`
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${{
          name: 'b' as const,
          default: 'default',
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({
      a: 'a',
    })

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'a default',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b' as const, default: 'default' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${{
          name: 'b' as const,
        }} ${'c'}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b' }, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${{
          name: 'b' as const,
          default: 'default',
        }} ${'c'}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'a default c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b' as const, default: 'default' }, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${'b'} ${{
          name: 'b' as const,
          default: 'default',
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', 'b', { name: 'b' as const, default: 'default' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles invalid input variable `InputVariableName`', () => {
    const invalidInputVariableName = 0

    const getChatPromptTemplate = () =>
      ChatPromptTemplate.from([
        {
          role: 'system',
          promptTemplate: PromptTemplate.create`${{
            // @ts-expect-error
            name: invalidInputVariableName,
          }}`,
        },
      ])

    expect(getChatPromptTemplate).toThrow()
  })

  it('handles invalid input variable `InputVariableConfig`', () => {
    const invalidInputVariableConfig = {}

    const getChatPromptTemplate = () =>
      ChatPromptTemplate.from([
        {
          role: 'system',
          promptTemplate: PromptTemplate.create`${{
            // @ts-expect-error
            invalidInputVariableConfig,
          }}`,
        },
      ])

    expect(getChatPromptTemplate).toThrow()
  })

  it('handles invalid input variable `PromptTemplate` instance', () => {
    const invalidInputVariablePromptTemplate = PromptTemplate

    const getChatPromptTemplate = () =>
      ChatPromptTemplate.from([
        {
          role: 'system',
          promptTemplate: PromptTemplate.create`${
            // @ts-expect-error
            invalidInputVariablePromptTemplate
          }`,
        },
      ])

    expect(getChatPromptTemplate).toThrow()
  })

  it('handles missing input values from `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'}`,
      },
    ])

    const getMessages = () =>
      // @ts-expect-error
      chatPromptTemplate.format()

    expect(getMessages).toThrow()
  })

  it('handles missing input values from `InputVariableConfig`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${{
          name: 'b' as const,
        }}`,
      },
    ])

    const getMessages = () =>
      // @ts-expect-error
      chatPromptTemplate.format({
        a: 'a',
      })

    expect(getMessages).toThrow()
  })

  it('handles missing input values from `PromptTemplate` instance', () => {
    const nestedPromptTemplate = PromptTemplate.create`${'c'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${{
          name: 'b' as const,
        }} ${nestedPromptTemplate}`,
      },
    ])

    const getMessages = () =>
      // @ts-expect-error
      chatPromptTemplate.format({
        a: 'a',
        b: 'b',
      })

    expect(getMessages).toThrow()
  })
})

describe('chatPromptTemplate nested', () => {
  it('handles empty string', () => {
    const promptTemplateNested = PromptTemplate.create``

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles basic string', () => {
    const promptTemplateNested = PromptTemplate.create`0`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b' as const,
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({ b: 'b' })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'b',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({})

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'default',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({
      a: 'a',
    })

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'a default',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }} ${'c'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }} ${'c'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'a default c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${'b'} ${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', 'b', promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })
})

describe('chatPromptTemplate deeply nested', () => {
  it('handles empty string', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create``

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles basic string', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`0`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b' as const,
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({ b: 'b' })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'b',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({})

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'default',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({
      a: 'a',
    })

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'a default',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    const promptWithDefault = chatPromptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toEqual([
      {
        role: 'system',
        content: 'a default c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles each `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep} ${'b'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${promptTemplateNested} ${'c'}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b c',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [promptTemplateNested, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${'b'} ${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${'a'} ${promptTemplateNested}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a b b',
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })
})

describe('chatPromptTemplate `InputVariableConfig`', () => {
  it('handles `InputVariableConfig` with `schema` basic', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${{
          name: 'a' as const,
          schema: z.string(),
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'a',
      },
    ])
  })

  it('handles `InputVariableConfig` with `schema` min length', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${{
          name: 'a' as const,
          schema: z.string().min(2),
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'aa',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'aa',
      },
    ])

    const getMessages = () =>
      chatPromptTemplate.format({
        a: 'a',
      })

    expect(getMessages).toThrow()
  })

  it('handles `InputVariableConfig` with `onFormat`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${{
          name: 'a' as const,
          onFormat: (inputValue) => inputValue.toUpperCase(),
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'A',
      },
    ])
  })

  it('handles `InputVariableConfig` with `schema` min length and `onFormat`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`${{
          name: 'a' as const,
          schema: z.string().min(2),
          onFormat: (inputValue) => inputValue.toUpperCase(),
        }}`,
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'aa',
    })

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'AA',
      },
    ])

    const getMessages = () =>
      chatPromptTemplate.format({
        a: 'a',
      })

    expect(getMessages).toThrow()
  })
})

describe('chatPromptTemplate `PromptTemplateOptions`', () => {
  it('handles `PromptTemplateOptions` with `dedent` default', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create`
          0
            1
        `,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0\n  1',
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `dedent` explicit', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({ dedent: true })`
            0
              1
          `,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0\n  1',
      },
    ])
  })

  it('handles `PromptTemplateOptions` without `dedent`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({ dedent: false })`
          0
            1
        `,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '\n          0\n            1\n        ',
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `dedent` multiple overrides', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({ dedent: false })({
          dedent: true,
        })`
            0
              1
          `,
      },
    ])
    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0\n  1',
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `prefix`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({ prefix: 'prefix' })`0`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'prefix0',
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `suffix`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({ suffix: 'suffix' })`0`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: '0suffix',
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `prefix` and `suffix`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({
          prefix: 'prefix',
          suffix: 'suffix',
        })`0`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'prefix0suffix',
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `prefix` and `suffix` multiple overrides', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'system',
        promptTemplate: PromptTemplate.create({
          prefix: 'prefix1',
          suffix: 'suffix1',
        })({
          prefix: 'prefix2',
          suffix: 'suffix2',
        })`0`,
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'system',
        content: 'prefix20suffix2',
      },
    ])
  })
})

function testInputVariables(
  chatPromptTemplate: ChatPromptTemplateBase,
  expected: {
    inputVariables: PromptTemplateInputVariable[]
    inputVariableNames: PromptTemplateInputVariableName[]
    inputVariableNamesOptional: PromptTemplateInputVariableName[]
    inputVariableNamesRequired: PromptTemplateInputVariableName[]
  },
) {
  expect(chatPromptTemplate.getInputVariables()).toEqual(
    expected.inputVariables,
  )

  expect(chatPromptTemplate.getInputVariableNames()).toEqual(
    expected.inputVariableNames,
  )

  expect(chatPromptTemplate.getInputVariableNamesOptional()).toEqual(
    expected.inputVariableNamesOptional,
  )

  expect(chatPromptTemplate.getInputVariableNamesRequired()).toEqual(
    expected.inputVariableNamesRequired,
  )
}
