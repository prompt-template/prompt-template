import { describe, it, expect } from 'vitest'
import { PromptTemplate } from '@prompt-template/core'

import { camelCase, withCamelCase } from '../camel-case.js'

describe('camelCase formatter', () => {
  it('formats with `onFormat` `inputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`
      ${{ name: 'input', onFormat: camelCase }}
    `

    const prompt = promptTemplate.format({
      input: 'foo bar',
    })

    expect(prompt).toBe('fooBar')
  })

  it('creates named `inputVariableConfig` with `onFormat`', () => {
    const promptTemplate = PromptTemplate.create`
      ${withCamelCase('input')}
    `

    const prompt = promptTemplate.format({
      input: 'foo bar',
    })

    expect(prompt).toBe('fooBar')
  })

  it('creates named `inputVariableConfig` with `onFormat` and empty options', () => {
    const promptTemplate = PromptTemplate.create`
      ${withCamelCase('input', {})}
    `

    const prompt = promptTemplate.format({
      input: 'foo bar',
    })

    expect(prompt).toBe('fooBar')
  })

  it('creates named `inputVariableConfig` with `onFormat` and `default` option', () => {
    const promptTemplate = PromptTemplate.create`
      ${withCamelCase('input', { default: 'default' })}
    `

    const prompt = promptTemplate.format({
      input: 'foo bar',
    })

    expect(prompt).toBe('fooBar')

    const prompt2 = promptTemplate.format({})

    expect(prompt2).toBe('default')
  })

  it('creates named `inputVariableConfig` with `onFormat` and `formatterOptions`', () => {
    const promptTemplate = PromptTemplate.create`
      ${withCamelCase('input', { formatterOptions: { delimiter: ' ' } })}
    `

    const prompt = promptTemplate.format({
      input: 'foo-bar',
    })

    expect(prompt).toBe('foo Bar')
  })
})
