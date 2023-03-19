// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

type Investor = {
  age: number,
  targetRetirementAge: number
}

type ChatGptFeedback = {
  feedback: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatGptFeedback>
) {
  // const { body } = req;
  // const { body.number } = body;
  // const investorName = req.body.name;
  // const 
  const { age, targetRetirementAge, stocks } = req.body

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    temperature: 0,
    max_tokens: 7,
  });

  console.log("RESPONSE", response)

  res.status(200).json({ feedback: 'John Doe' })
}
