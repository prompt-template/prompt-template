/**
pnpm tsx examples/basic.ts
*/
import { PromptTemplate } from '@prompt-template/core'
import { ChatPromptTemplate } from '@prompt-template/ai-sdk'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

import './env.js'

const chatPromptTemplate = ChatPromptTemplate.from([
  {
    role: 'system',
    content: 'You are a friendly assistant.',
  },
  {
    role: 'user',
    promptTemplate: PromptTemplate.create`
      Brainstorm 3 names for a superhero ${'animal'}.
    `,
  },
])

const messages = chatPromptTemplate.format({
  animal: 'cat',
})

console.log(messages)
//=> [
//     { role: 'system', content: 'You are a friendly assistant.' },
//     { role: 'user', content: 'Brainstorm 3 names for a superhero cat.' }
//   ]

const completion = await generateText({
  model: openai('gpt-4o-mini'),
  messages,
})

console.log(completion.text)