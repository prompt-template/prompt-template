import { PromptTemplate } from '@prompt-template/core'
import { describe, it, expect } from 'vitest'

import { toParseArgsConfig } from '../to-parse-args-config.js'

describe('promptTemplate', () => {
  it('handles empty string', () => {
    const promptTemplate = PromptTemplate.create``

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles basic string', () => {
    const promptTemplate = PromptTemplate.create`0`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${{ name: 'b' }}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${{
      name: 'b',
      default: 'default',
    }}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles duplicate inputVariables reversed', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'b'}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })
})

describe('promptTemplate nested', () => {
  it('handles empty string', () => {
    const promptTemplateNested = PromptTemplate.create``

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles basic string', () => {
    const promptTemplateNested = PromptTemplate.create`0`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplateNested = PromptTemplate.create`${{ name: 'b' }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`

    const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })
})

describe('promptTemplate deeply nested', () => {
  it('handles empty string', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create``

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles basic string', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`0`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{ name: 'b' }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles each `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep} ${'b'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested} ${'c'}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${'b'} ${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${'a'} ${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })

  it('handles duplicate inputVariables reversed', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'b'}`

    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }} ${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${'a'} ${promptTemplateNested}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })
})

describe('promptTemplate `InputVariableConfig`', () => {
  it('handles `InputVariableConfig` with `description`', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'a',
      description: 'foo',
    }}`

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
      },
    })
  })

  it('handles `InputVariableConfig` with `description` nested', () => {
    const promptTemplateNested = PromptTemplate.create`
        ${{ name: 'b', description: 'bar' }}
      `

    const promptTemplate = PromptTemplate.create`
        ${{ name: 'a', description: 'foo' }}
        ${promptTemplateNested}
      `

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {
        a: { type: 'string' },
        b: { type: 'string' },
      },
    })
  })
})

describe('promptTemplate `PromptTemplateOptions`', () => {
  it('handles `PromptTemplateOptions` with `description` default', () => {
    const promptTemplate = PromptTemplate.create``

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })

  it('handles `PromptTemplateOptions` with `description` explicit', () => {
    const promptTemplate = PromptTemplate.create({ description: 'foo' })``

    expect(toParseArgsConfig(promptTemplate)).toEqual({
      options: {},
    })
  })
})

// TODO: Uncomment when a shared `ChatPromptTemplate` interface is created

// describe('chatPromptTemplate', () => {
//   it('handles empty string', () => {
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create``,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles basic string', () => {
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`0`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
//       name: 'name',
//       description: undefined,
//       arguments: [],
//     })
//   })

//   it('handles `InputVariableName`', () => {
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${{ name: 'b' }}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${{
//             name: 'b',
//             default: 'default',
//           }}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'} ${{
//             name: 'b',
//             default: 'default',
//           }}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'} ${{
//             name: 'b',
//             default: 'default',
//           }} ${'c'}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'} ${'b'} ${{
//             name: 'b',
//             default: 'default',
//           }}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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

//   it('handles duplicate inputVariables reversed', () => {
//     const chatPromptTemplate = ChatPromptTemplate.from([
//       {
//         role: 'user',
//         content: {
//           type: 'text',
//           promptTemplate: PromptTemplate.create`${'a'} ${{
//             name: 'b',
//             default: 'default',
//           }} ${'b'}`,
//         },
//       },
//     ])

//     expect(toParseArgsConfig('name', chatPromptTemplate)).toEqual({
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
// })
