import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid PDF ID' });
  }

  try {
    const pdf = await prisma.pDF.findUnique({
      where: { id },
    });

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    return res.status(200).json(pdf);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}