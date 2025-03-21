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
        role: 'assistant',
        content: { type: 'text', text: '0' },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0' },
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
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{ name: 'b' }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'b' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{
            name: 'b',
            default: 'default',
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({ b: 'b' })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({})

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'default' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [{ name: 'b', default: 'default' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b' },
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
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{
            name: 'b',
            default: 'default',
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a default' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b', default: 'default' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{
            name: 'b',
            default: 'default',
          }} ${'c'}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a default c' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b', default: 'default' }, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${'b'} ${{
            name: 'b',
            default: 'default',
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b b' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', 'b', { name: 'b', default: 'default' }],
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
          role: 'assistant',
          content: {
            type: 'text',
            promptTemplate: PromptTemplate.create`${{
              // @ts-expect-error
              name: invalidInputVariableName,
            }}`,
          },
        },
      ])

    expect(getChatPromptTemplate).toThrow()
  })

  it('handles invalid input variable `InputVariableConfig`', () => {
    const invalidInputVariableConfig = {}

    const getChatPromptTemplate = () =>
      ChatPromptTemplate.from([
        {
          role: 'assistant',
          content: {
            type: 'text',
            promptTemplate: PromptTemplate.create`${{
              // @ts-expect-error
              invalidInputVariableConfig,
            }}`,
          },
        },
      ])

    expect(getChatPromptTemplate).toThrow()
  })

  it('handles invalid input variable `PromptTemplate` instance', () => {
    const invalidInputVariablePromptTemplate = PromptTemplate

    const getChatPromptTemplate = () =>
      ChatPromptTemplate.from([
        {
          role: 'assistant',
          content: {
            type: 'text',
            promptTemplate: PromptTemplate.create`${
              // @ts-expect-error
              invalidInputVariablePromptTemplate
            }`,
          },
        },
      ])

    expect(getChatPromptTemplate).toThrow()
  })

  it('handles missing input values from `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'}`,
        },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }}`,
        },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }} ${nestedPromptTemplate}`,
        },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
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
    const promptTemplateNested = PromptTemplate.create`${{ name: 'b' }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'b' },
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
      name: 'b',
      default: 'default',
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({ b: 'b' })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({})

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'default' },
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
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b' },
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
      name: 'b',
      default: 'default',
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a default' },
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
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
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
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a default c' },
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
      name: 'b',
      default: 'default',
    }}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${'b'} ${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b b' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
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
    const promptTemplatedNestedDeep = PromptTemplate.create`${{ name: 'b' }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'b' },
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
      name: 'b',
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({ b: 'b' })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({})

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'default' },
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
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b' },
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
      name: 'b',
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a default' },
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
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
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
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a default c' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${promptTemplateNested} ${'c'}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b c' },
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
      name: 'b',
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${'b'} ${promptTemplatedNestedDeep}`

    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${promptTemplateNested}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a b b' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{
            name: 'a',
            schema: z.string(),
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
    ])
  })

  it('handles `InputVariableConfig` with `schema` min length', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{
            name: 'a',
            schema: z.string().min(2),
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'aa',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'aa' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{
            name: 'a',
            onFormat: (inputValue) => inputValue.toUpperCase(),
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'A' },
      },
    ])
  })

  it('handles `InputVariableConfig` with `schema` min length and `onFormat`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{
            name: 'a',
            schema: z.string().min(2),
            onFormat: (inputValue) => inputValue.toUpperCase(),
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'aa',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'AA' },
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
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`
          0
            1
        `,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0\n  1' },
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `dedent` explicit', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({ dedent: true })`
            0
              1
          `,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0\n  1' },
      },
    ])
  })

  it('handles `PromptTemplateOptions` without `dedent`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({ dedent: false })`
            0
              1
          `,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: '\n            0\n              1\n          ',
        },
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `dedent` multiple overrides', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({ dedent: false })({
            dedent: true,
          })`
            0
              1
          `,
        },
      },
    ])
    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0\n  1' },
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `prefix`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({ prefix: 'prefix' })`0`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'prefix0' },
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `suffix`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({ suffix: 'suffix' })`0`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0suffix' },
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `prefix` and `suffix`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({
            prefix: 'prefix',
            suffix: 'suffix',
          })`0`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'prefix0suffix' },
      },
    ])
  })

  it('handles `PromptTemplateOptions` with `prefix` and `suffix` multiple overrides', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create({
            prefix: 'prefix1',
            suffix: 'suffix1',
          })({
            prefix: 'prefix2',
            suffix: 'suffix2',
          })`0`,
        },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'prefix20suffix2' },
      },
    ])
  })
})

describe('chatPromptTemplate messages', () => {
  it('handles multiple messages', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: { type: 'text', promptTemplate: PromptTemplate.create`0` },
      },
      {
        role: 'user',
        content: { type: 'text', promptTemplate: PromptTemplate.create`1` },
      },
    ])

    const messages = chatPromptTemplate.format()

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: '0' },
      },
      {
        role: 'user',
        content: { type: 'text', text: '1' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles multiple messages with `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: { type: 'text', promptTemplate: PromptTemplate.create`a` },
      },
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'b'}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['b'],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles multiple messages with `InputVariableConfig`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: { type: 'text', promptTemplate: PromptTemplate.create`a` },
      },
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{ name: 'b' }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [{ name: 'b' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles multiple messages with `InputVariableConfig` with `default`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: { type: 'text', promptTemplate: PromptTemplate.create`a` },
      },
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{
            name: 'b',
            default: 'default',
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({})

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'default' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: [{ name: 'b', default: 'default' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles multiple messages with `InputVariableName` and `InputVariableConfig`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: { type: 'text', promptTemplate: PromptTemplate.create`a` },
      },
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'b'} ${{ name: 'c' }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b c' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['b', { name: 'c' }],
      inputVariableNames: ['b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b', 'c'],
    })
  })

  it('handles multiple messages with `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: { type: 'text', promptTemplate: PromptTemplate.create`a` },
      },
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'b'} ${{
            name: 'c',
            default: 'default',
          }}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b c' },
      },
    ])

    const messagesWithDefault = chatPromptTemplate.format({
      b: 'b',
    })

    expect(messagesWithDefault).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b default' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['b', { name: 'c', default: 'default' }],
      inputVariableNames: ['b', 'c'],
      inputVariableNamesOptional: ['c'],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles multiple messages with `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'assistant',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'}`,
        },
      },
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{ name: 'b' }} ${'c'}`,
        },
      },
    ])

    const messages = chatPromptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(messages).toEqual([
      {
        role: 'assistant',
        content: { type: 'text', text: 'a' },
      },
      {
        role: 'user',
        content: { type: 'text', text: 'b c' },
      },
    ])

    testInputVariables(chatPromptTemplate, {
      inputVariables: ['a', { name: 'b' }, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
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
