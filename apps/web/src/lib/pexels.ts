/**
 * Pexels API client — searches for free stock photos.
 *
 * Uses the Pexels API free tier (200 requests/month, 200 per hour).
 * The API key comes from the VITE_PEXELS_API_KEY env variable.
 *
 * Pexels returns photos with `src` URLs at multiple sizes:
 * - tiny: 280px height (for grid preview)
 * - small: 130px height
 * - medium: scaled to 350px height max
 * - large: original with max width 940px
 * - original: full resolution
 *
 * We use `tiny` for thumbnails and `large` for canvas insertion.
 *
 * Pexels API docs: https://www.pexels.com/api/documentation/
 * Get a free key at: https://www.pexels.com/api/new/
 */

const API_BASE = 'https://api.pexels.com/v1';

/** A Pexels photo — normalized to match our internal photo format */
export interface PexelsPhoto {
  id: number;
  alt: string;
  photographer: string;
  photographer_url: string;
  src: {
    tiny: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  width: number;
  height: number;
}

interface PexelsSearchResult {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
  next_page?: string;
}

/** Check if the Pexels API key is configured */
export function isPexelsConfigured(): boolean {
  return !!getApiKey();
}

function getApiKey(): string {
  return localStorage.getItem('monet-pexels-key') || import.meta.env.VITE_PEXELS_API_KEY || '';
}

/**
 * Search Pexels for photos matching a query.
 *
 * @param query - Search term (e.g., "mountain", "coffee")
 * @param page - Page number for pagination (starts at 1)
 * @param perPage - Results per page (max 80, default 20)
 * @returns Array of photo results and total page count
 */
export async function searchPexelsPhotos(
  query: string,
  page: number = 1,
  perPage: number = 20,
): Promise<{ photos: PexelsPhoto[]; totalPages: number }> {
  const key = getApiKey();
  if (!key) {
    return { photos: [], totalPages: 0 };
  }

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
  });

  const res = await fetch(`${API_BASE}/search?${params}`, {
    headers: { Authorization: key },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  const data: PexelsSearchResult = await res.json();
  return {
    photos: data.photos,
    totalPages: Math.ceil(data.total_results / perPage),
  };
}
