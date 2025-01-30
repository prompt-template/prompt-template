import { describe, it, expect } from 'vitest'
import { PromptTemplate } from '@prompt-template/core'
import { preserveIndent } from '../preserve-indent.js'

describe('preserveIndent formatter', () => {
  it.only('formats with `onFormat` `inputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`
      foo
        ${{ name: 'input', onFormat: preserveIndent }}
    `

    const prompt = promptTemplate.format({
      input: ['bar', 'baz'].join('\n'),
    })

    expect(prompt).toBe('foo\n  bar\n  baz')
  })

  it('creates named `inputVariableConfig` with `onFormat`', () => {
    const promptTemplate = PromptTemplate.create`
      foo
        ${preserveIndent('input')}
    `

    const prompt = promptTemplate.format({
      input: ['bar', 'baz'].join('\n'),
    })

    expect(prompt).toBe('foo\n  bar\n  baz')
  })

  it('creates named `inputVariableConfig` with `onFormat` and empty options', () => {
    const promptTemplate = PromptTemplate.create`
      foo
        ${preserveIndent('input', {})}
    `

    const prompt = promptTemplate.format({
      input: ['bar', 'baz'].join('\n'),
    })

    expect(prompt).toBe('foo\n  bar\n  baz')
  })

  it('creates named `inputVariableConfig` with `onFormat` and `default` option', () => {
    const promptTemplate = PromptTemplate.create`
      foo
        ${preserveIndent('input', { default: 'default' })}
    `

    const prompt = promptTemplate.format({
      input: ['bar', 'baz'].join('\n'),
    })

    expect(prompt).toBe('foo\n  bar\n  baz')

    const prompt2 = promptTemplate.format({})

    expect(prompt2).toBe('foo\n  default')
  })
})
