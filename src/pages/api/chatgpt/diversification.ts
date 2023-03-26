// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

type ChatGptFeedback = {
  feedback: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any> // TODO: add type
) {
  const { investor, portfolioHoldings } = req.body

  // TODO: add type for stock
  const holdingsToAllocationString = req.body.portfolioHoldings.reduce((acc: string, stock: any) => {
    return acc + `${stock.ticker}: ${stock.allocation}%\n`
  }, '')

  const portfolioDiversificationMessage = `
    Is my portfolio diversified enough? These are my holdings and allocations:\n
    ${holdingsToAllocationString}
  `

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: 'You are a financial advisor, providing financial advice for my investment portfolio.' },
      { role: 'user', content: portfolioDiversificationMessage }
    ],
  });

  const response = {
    diversification: completion.data.choices[0].message?.content
  }

  if (response) {
    res.status(200).json(response)
  } else {
    res.status(500)
  }
}
