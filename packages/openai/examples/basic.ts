/**
npx tsx examples/basic.ts
*/
import { PromptTemplate } from '@prompt-template/core'
import { ChatPromptTemplate } from '@prompt-template/openai'
import { OpenAI } from 'openai'

import './env.js'

const chatPromptTemplate = ChatPromptTemplate.from([
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
// { role: 'user', content: 'Brainstorm 3 names for a superhero cat.' }

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages,
})

console.log(completion.choices[0]?.message.content)
