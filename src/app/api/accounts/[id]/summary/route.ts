import { getAccountSummary } from '@/lib/db/queries/accounts';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const accountId = Number(req.query.accountId);
      
      if (isNaN(accountId)) {
        return res.status(400).json({ error: 'Invalid account ID' });
      }

      const summary = await getAccountSummary(accountId);
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching account summary:', error);
      res.status(500).json({ error: 'Failed to fetch account summary' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}