import { PromptTemplate } from '@prompt-template/core'
import { promptTemplateToZod } from '@prompt-template/to-zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { ChatPromptTemplate } from '../chat-prompt-template/chat-prompt-template.js'

type MCPServerPromptArgs = Parameters<McpServer['prompt']>

export function addPrompt(
  mcpServer: McpServer,
  name: MCPServerPromptArgs[0],
  promptTemplate: PromptTemplate<any> | ChatPromptTemplate<any>,
): void {
  const promptTemplateDescription: MCPServerPromptArgs[1] =
    promptTemplate.description ?? ''

  const promptTemplateSchemaShape: MCPServerPromptArgs[2] =
    promptTemplateToZod(promptTemplate).shape

  mcpServer.prompt(
    name,
    promptTemplateDescription,
    promptTemplateSchemaShape,
    (inputValues) => ({
      messages:
        promptTemplate instanceof ChatPromptTemplate
          ? promptTemplate.format(inputValues)
          : [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: promptTemplate.format(inputValues),
                },
              },
            ],
    }),
  )
}
