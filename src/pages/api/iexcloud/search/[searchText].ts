// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IexCloudStockSearchResult } from '@/models/IexCloudStockSearchResult';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  // res: NextApiResponse<IexCloudStockSearchResult>
  res: NextApiResponse<any>
) {
  const { searchText } = req.query
  console.log("SearchText: ", searchText)
  fetch(`https://cloud.iexapis.com/stable/search/${searchText}?token=${process.env.IEX_CLOUD_API_TOKEN}`)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
        console.log("ERROR", err.message);
    });

  // res.status(200).json([{ symbol: 'MSFT', securityName: 'Microsoft' }])
}
