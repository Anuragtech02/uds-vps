export const runtime = 'edge';

import type { NextApiRequest, NextApiResponse } from 'next'

interface StrapiAttribute {
  tagSlug: string
  reportSlug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface StrapiData {
  id: number
  attributes: StrapiAttribute
}

interface StrapiResponse {
  data: StrapiData[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface ErrorResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tag } = req.query

  // Validate tag parameter
  if (!tag || Array.isArray(tag)) {
    return res.status(400).json({ error: 'Invalid tag parameter' })
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/tag-mappings?filters[tagSlug][$eq]=${tag}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`
        }
      }
    );

    const data: StrapiResponse = await response.json();
    
    if (data.data && data.data.length > 0) {
      const reportSlug = data.data[0].attributes.reportSlug;
      return res.redirect(301, `/report/${reportSlug}`);
    }

    return res.status(404).json({ error: 'Tag not found' });

  } catch (error) {
    console.error('Error fetching tag mapping:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}