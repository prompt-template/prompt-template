/**
pnpm tsx examples/basic.ts
*/
import { PromptTemplate } from '@prompt-template/core'
import { OpenAI } from 'openai'

import './env.js'

const promptTemplate = PromptTemplate.create`
  Brainstorm 3 names for a superhero ${'animal'}.
`

const prompt = promptTemplate.format({
  animal: 'cat',
})

console.log(prompt)
// 'Brainstorm 3 names for a superhero cat.'

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: prompt,
    },
  ],
})

console.log(completion.choices[0]?.message.content)
