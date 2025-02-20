import { expectTypeOf, test } from 'vitest'
import { PromptTemplate } from '@prompt-template/core'
import type { EmptyObject } from 'type-fest'

import { ChatPromptTemplate } from '../chat-prompt-template.js'

test('`chatPromptTemplate` with empty messages', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([])

  type Messages = never[]

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})

test('`chatPromptTemplate` with basic message', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([
    { role: 'assistant', content: { type: 'text', text: '0' } },
  ])

  type Messages = {
    role: 'assistant'
    content: { type: 'text'; text: string }
  }[]

  type InputValues = EmptyObject | void | undefined

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})

test('`chatPromptTemplate` with literal `InputVariableName`', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([
    {
      role: 'user',
      content: { type: 'text', promptTemplate: PromptTemplate.create`${'a'}` },
    },
  ])

  type Messages = {
    role: 'user'
    content: { type: 'text'; promptTemplate: PromptTemplate<readonly ['a']> }
  }[]

  type InputValues = { a: string }

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})

test('`chatPromptTemplate` with `InputVariableConfig`', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([
    {
      role: 'assistant',
      content: {
        type: 'text',
        promptTemplate: PromptTemplate.create`${{ name: 'b' }}`,
      },
    },
  ])

  type Messages = {
    role: 'assistant'
    content: {
      type: 'text'
      promptTemplate: PromptTemplate<readonly [{ readonly name: 'b' }]>
    }
  }[]

  type InputValues = { b: string }

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})

test('`chatPromptTemplate` with `InputVariableConfig` and default', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([
    {
      role: 'assistant',
      content: {
        type: 'text',
        promptTemplate: PromptTemplate.create`${{ name: 'b', default: 'value' }}`,
      },
    },
  ])

  type Messages = {
    role: 'assistant'
    content: {
      type: 'text'
      promptTemplate: PromptTemplate<
        readonly [
          {
            readonly name: 'b'
            readonly default: 'value'
          },
        ]
      >
    }
  }[]

  type InputValues = { b?: string } | undefined | void

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})

test('`chatPromptTemplate` with multiple `InputVariableName` and `InputVariableConfig` with default', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([
    {
      role: 'user',
      content: {
        type: 'text',
        promptTemplate: PromptTemplate.create`${'a'}`,
      },
    },
    {
      role: 'assistant',
      content: {
        type: 'text',
        promptTemplate: PromptTemplate.create`${{ name: 'b', default: 'value' }}`,
      },
    },
  ])

  type Messages = (
    | {
        role: 'user'
        content: {
          type: 'text'
          promptTemplate: PromptTemplate<readonly ['a']>
        }
      }
    | {
        role: 'assistant'
        content: {
          type: 'text'
          promptTemplate: PromptTemplate<
            readonly [
              {
                readonly name: 'b'
                readonly default: 'value'
              },
            ]
          >
        }
      }
  )[]

  type InputValues = { a: string; b?: string }

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})

test('`chatPromptTemplate` multiple messages and nested PromptTemplate', () => {
  const chatPromptTemplate = ChatPromptTemplate.from([
    {
      role: 'assistant',
      content: {
        type: 'text',
        text: '0',
      },
    },
    {
      role: 'user',
      content: {
        type: 'text',
        promptTemplate: PromptTemplate.create`${'a'}`,
      },
    },
    {
      role: 'assistant',
      content: {
        type: 'text',
        promptTemplate: PromptTemplate.create`${{ name: 'b', default: 'value' }} ${PromptTemplate.create`${'c'}`}`,
      },
    },
  ])

  type Messages = (
    | {
        role: 'assistant'
        content: {
          type: 'text'
          text: string
          promptTemplate?: never
        }
      }
    | {
        role: 'user'
        content: {
          type: 'text'
          promptTemplate: PromptTemplate<readonly ['a']>
          text?: never
        }
      }
    | {
        role: 'assistant'
        content: {
          type: 'text'
          promptTemplate: PromptTemplate<
            readonly [
              {
                readonly name: 'b'
                readonly default: 'value'
              },
              PromptTemplate<readonly ['c']>,
            ]
          >
          text?: never
        }
      }
  )[]

  type InputValues = {
    a: string
    b?: string
    c: string
  }

  expectTypeOf(chatPromptTemplate).toEqualTypeOf<ChatPromptTemplate<Messages>>()

  expectTypeOf(chatPromptTemplate.format)
    .parameter(0)
    .toEqualTypeOf<InputValues>()
})
