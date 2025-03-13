import { PromptTemplate } from '@prompt-template/core'
import { describe, it, expect, vi } from 'vitest'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { addPrompt } from '../add-prompt.js'
import { ChatPromptTemplate } from '../../chat-prompt-template/chat-prompt-template.js'

describe('addPrompt', () => {
  it('adds a prompt with empty string', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create``

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with basic string', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`0`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with `InputVariableName`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${'a'}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with `InputVariableConfig`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${{ name: 'b' }}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with `InputVariableConfig` with `default`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${{
      name: 'b',
      default: 'default',
    }}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with `InputVariableName` and `InputVariableConfig`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${'a'} ${{ name: 'b' }}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with duplicate inputVariables', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${{
      name: 'b',
      default: 'default',
    }}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a prompt with duplicate inputVariables reversed', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'b'}`

    addPrompt(mcpServer, 'name', promptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })
})

describe('addPrompt with ChatPromptTemplate', () => {
  it('adds a chat prompt with empty string', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create``,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with basic string', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`0`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with `InputVariableName`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with `InputVariableConfig`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${{ name: 'b' }}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with `InputVariableConfig` with `default`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
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

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with `InputVariableName` and `InputVariableConfig`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{
            name: 'b',
            default: 'default',
          }}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{ name: 'b' }} ${'c'}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with duplicate inputVariables', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${'b'} ${{
            name: 'b',
            default: 'default',
          }}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('adds a chat prompt with duplicate inputVariables reversed', () => {
    const mcpServer = { prompt: vi.fn() } as unknown as McpServer
    const chatPromptTemplate = ChatPromptTemplate.from([
      {
        role: 'user',
        content: {
          type: 'text',
          promptTemplate: PromptTemplate.create`${'a'} ${{
            name: 'b',
            default: 'default',
          }} ${'b'}`,
        },
      },
    ])

    addPrompt(mcpServer, 'name', chatPromptTemplate)

    expect(mcpServer.prompt).toHaveBeenCalledWith(
      'name',
      '',
      expect.any(Object),
      expect.any(Function),
    )
  })
})
