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

  const holdingsToAllocationString = req.body.portfolioHoldings.reduce((acc, stock) => {
    return acc + `${stock.ticker}: ${stock.allocation}%\n`
  }, '')

  console.log(holdingsToAllocationString)

  // TODO: riskTolerance not working
  const portfolioSummaryMessage = `
    My stock portfolio consists of the following: \n
      ${holdingsToAllocationString}
    Is this a good stock portfolio for a ${investor.age} year old with an aggressive risk tolerance?
  `

  const portfolioRiskAssessmentMessage = `
    My stock portfolio consists of the following:
      ${holdingsToAllocationString}
    Is this portfolio to risky for a 29 year old with a high risk tolerance, who aims to retire by 50?
  `

  // TODO: riskTolerance not working
  // const portfolioStockRecommendations = `
  // Could you recommend some stocks to add to my portfolio? I am a ${investor.age} year old with an aggressive tolerance who aims to retire by ${investor.retirementAge}. The following is my portfolio: \n
  //     ${holdingsToAllocationString}
  // `
  const portfolioStockRecommendations = `
    Is this a good stock portfolio for a 29 year old with a high risk tolerance who aims to retire by 50? What \n 
    MSFT: 20%
    AAPL: 20%
    AMZN: 15%
    TSLA: 15%
    NVDA: 10%
    JNJ: 5%
    JPM: 5%
    V: 5%
    MA: 5% \n
    Could you recommend some stocks to add?
  `

  const portfolioDiversificationMessage = `
    Is my portfolio diversified enough? These are my holdings and allocations:\n
    ${holdingsToAllocationString}
  `

  console.log('PROMPT: ', portfolioStockRecommendations)

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      // { role: "user", content: portfolioSummaryMessage },
      // { role: 'user', content: portfolioRiskAssessmentMessage },
      { role: 'system', content: 'You are a financial advisor, providing financial advice for my investment portfolio.' },
      { role: 'user', content: portfolioStockRecommendations }
    ],
  });

  // console.log("RESPONSE", completion)
  // console.log("COMPLETION:", completion.data.choices[0].message);
  // const apiFeedback = completion.data?.choices[0].message?.content;

  console.log("CHOICES: ", completion.data.choices)
  console.log("CHOICES LENGTH: ", completion.data.choices.length)

  const response = {
    // generalPortfolioFeedback: completion.data.choices[0].message,
    // riskAssessment: completion.data.choices[1].message,
    recommendedStocks: completion.data.choices[0].message
    // recommendedStocks: completion.data.choices[0].text
  }

  if (response) {
    res.status(200).json(response)
  } else {
    res.status(500)
  }
}
