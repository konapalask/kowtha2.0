import { NextApiRequest, NextApiResponse } from 'next';
import { getMobileSchemaByBank, getSupportedBanks } from '@/utils/mobileSchemaLoader';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bankName } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!bankName || typeof bankName !== 'string') {
    return res.status(400).json({ error: 'Bank name is required' });
  }

  try {
    // Get the schema for the specified bank
    const schema = getMobileSchemaByBank(bankName);

    if (!schema) {
      return res.status(404).json({ 
        error: 'Bank form not found',
        supportedBanks: getSupportedBanks()
      });
    }

    res.status(200).json(schema);
  } catch (error) {
    console.error('Error loading schema:', error);
    res.status(500).json({ error: 'Failed to load schema' });
  }
}
