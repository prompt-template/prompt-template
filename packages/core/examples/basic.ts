/**
npx tsx examples/basic.ts
*/
import { promptTemplate } from '@prompt-template/core'
import { OpenAI } from 'openai'

import './env.js'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 names for a superhero ${'animal'}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})

console.log(brainstormPrompt)
// 'Brainstorm 3 names for a superhero cat.'

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: brainstormPrompt,
    },
  ],
})

console.log(completion.choices[0]?.message.content)
