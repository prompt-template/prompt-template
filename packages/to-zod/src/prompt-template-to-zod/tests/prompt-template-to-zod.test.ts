import { PromptTemplate } from '@prompt-template/core'
import { describe, it, expect } from 'vitest'

import { promptTemplateToZod } from '../prompt-template-to-zod.js'

describe('promptTemplate', () => {
  it('handles empty string', () => {
    const promptTemplate = PromptTemplate.create``
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({}).success).toBe(true)
  })

  it('handles basic string', () => {
    const promptTemplate = PromptTemplate.create`0`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({}).success).toBe(true)
  })

  it('handles `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ a: 'a' }).success).toBe(true)
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${{ name: 'b' }}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ b: 'b' }).success).toBe(true)
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({}).success).toBe(true)
    expect(promptTemplateSchema.safeParse({ b: 'b' }).success).toBe(true)
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{ name: 'b' }}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ a: 'a', b: 'b' }).success).toBe(
      true,
    )
    expect(promptTemplateSchema.safeParse({ a: 'a' }).success).toBe(false)
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ a: 'a' }).success).toBe(true)
    expect(promptTemplateSchema.safeParse({ a: 'a', b: 'b' }).success).toBe(
      true,
    )
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(
      promptTemplateSchema.safeParse({ a: 'a', b: 'b', c: 'c' }).success,
    ).toBe(true)
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ a: 'a', c: 'c' }).success).toBe(
      true,
    )
    expect(
      promptTemplateSchema.safeParse({ a: 'a', b: 'b', c: 'c' }).success,
    ).toBe(true)
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${{
      name: 'b',
      default: 'default',
    }}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ a: 'a', b: 'b' }).success).toBe(
      true,
    )
    expect(promptTemplateSchema.safeParse({ a: 'a' }).success).toBe(false)
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })

  it('handles duplicate inputVariables reversed', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'b'}`
    const promptTemplateSchema = promptTemplateToZod(promptTemplate)

    expect(promptTemplateSchema.safeParse({ a: 'a', b: 'b' }).success).toBe(
      true,
    )
    expect(promptTemplateSchema.safeParse({ a: 'a' }).success).toBe(false)
    expect(promptTemplateSchema.safeParse({}).success).toBe(false)
  })
})

// TODO: Finish updating the following tests

// describe('promptTemplate nested', () => {
//   it('handles empty string', () => {
//     const promptTemplateNested = PromptTemplate.create``

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles basic string', () => {
//     const promptTemplateNested = PromptTemplate.create`0`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles `InputVariableName`', () => {
//     const promptTemplateNested = PromptTemplate.create`${'a'}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableConfig`', () => {
//     const promptTemplateNested = PromptTemplate.create`${{ name: 'b' }}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'b',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableConfig` with `default`', () => {
//     const promptTemplateNested = PromptTemplate.create`${{
//       name: 'b',
//       default: 'default',
//     }}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName` and `InputVariableConfig`', () => {
//     const promptTemplateNested = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
//     const promptTemplateNested = PromptTemplate.create`${'a'} ${{
//       name: 'b',
//       default: 'default',
//     }}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
//     const promptTemplateNested = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: true,
//         },
//         {
//           name: 'c',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
//     const promptTemplateNested = PromptTemplate.create`${'a'} ${{
//       name: 'b',
//       default: 'default',
//     }} ${'c'}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//         {
//           name: 'c',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles duplicate inputVariables', () => {
//     const promptTemplateNested = PromptTemplate.create`${{
//       name: 'b',
//       default: 'default',
//     }}`

//     const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })
// })

// describe('promptTemplate deeply nested', () => {
//   it('handles empty string', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create``

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles basic string', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`0`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles `InputVariableName`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableConfig`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${{ name: 'b' }}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'b',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableConfig` with `default`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${{
//       name: 'b',
//       default: 'default',
//     }}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName` and `InputVariableConfig`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
//       name: 'b',
//       default: 'default',
//     }}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: true,
//         },
//         {
//           name: 'c',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
//       name: 'b',
//       default: 'default',
//     }} ${'c'}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//         {
//           name: 'c',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles each `InputVariableName`', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

//     const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep} ${'b'}`

//     const promptTemplate = PromptTemplate.create`${promptTemplateNested} ${'c'}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'c',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: true,
//         },
//         {
//           name: 'a',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles duplicate inputVariables', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${{
//       name: 'b',
//       default: 'default',
//     }}`

//     const promptTemplateNested = PromptTemplate.create`${'b'} ${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${'a'} ${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })

//   it('handles duplicate inputVariables reversed', () => {
//     const promptTemplatedNestedDeep = PromptTemplate.create`${'b'}`

//     const promptTemplateNested = PromptTemplate.create`${{
//       name: 'b',
//       default: 'default',
//     }} ${promptTemplatedNestedDeep}`

//     const promptTemplate = PromptTemplate.create`${'a'} ${promptTemplateNested}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           required: true,
//         },
//         {
//           name: 'b',
//           required: false,
//         },
//       ],
//     })
//   })
// })

// describe('promptTemplate `InputVariableConfig`', () => {
//   it('handles `InputVariableConfig` with `description`', () => {
//     const promptTemplate = PromptTemplate.create`${{
//       name: 'a',
//       description: 'foo',
//     }}`

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           description: 'foo',
//           required: true,
//         },
//       ],
//     })
//   })

//   it('handles `InputVariableConfig` with `description` nested', () => {
//     const promptTemplateNested = PromptTemplate.create`
//         ${{ name: 'b', description: 'bar' }}
//       `

//     const promptTemplate = PromptTemplate.create`
//         ${{ name: 'a', description: 'foo' }}
//         ${promptTemplateNested}
//       `

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [
//         {
//           name: 'a',
//           description: 'foo',
//           required: true,
//         },
//         {
//           name: 'b',
//           description: 'bar',
//           required: true,
//         },
//       ],
//     })
//   })
// })

// describe('promptTemplate `PromptTemplateOptions`', () => {
//   it('handles `PromptTemplateOptions` with `description` default', () => {
//     const promptTemplate = PromptTemplate.create``

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles `PromptTemplateOptions` with `description` explicit', () => {
//     const promptTemplate = PromptTemplate.create({ description: 'foo' })``

//     expect(promptTemplateToZod(promptTemplate)).toEqual({
//       name: 'name',
//       description: 'foo',
//       arguments: [],
//     })
//   })
// })
