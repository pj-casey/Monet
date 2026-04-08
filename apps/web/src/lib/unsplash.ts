/**
 * Unsplash API client — searches for free stock photos.
 *
 * Uses the Unsplash API free tier (50 requests/hour for demo apps).
 * The API key comes from the VITE_UNSPLASH_ACCESS_KEY env variable.
 *
 * Photos are returned with URLs for different sizes:
 * - thumb: 200px wide (for the grid preview)
 * - small: 400px wide
 * - regular: 1080px wide (what we insert on the canvas)
 */

const API_BASE = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  description: string | null;
  urls: {
    thumb: string;
    small: string;
    regular: string;
  };
  user: {
    name: string;
    links: { html: string };
  };
  width: number;
  height: number;
}

interface UnsplashSearchResult {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

/** Check if the Unsplash API key is configured */
export function isUnsplashConfigured(): boolean {
  return !!getApiKey();
}

function getApiKey(): string {
  return import.meta.env.VITE_UNSPLASH_ACCESS_KEY ?? '';
}

/**
 * Search Unsplash for photos matching a query.
 *
 * @param query - Search term (e.g., "mountain", "coffee")
 * @param page - Page number for pagination (starts at 1)
 * @param perPage - Results per page (max 30)
 * @returns Array of photo results
 */
export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 20,
): Promise<{ photos: UnsplashPhoto[]; totalPages: number }> {
  const key = getApiKey();
  if (!key) {
    return { photos: [], totalPages: 0 };
  }

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
  });

  const res = await fetch(`${API_BASE}/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${key}` },
  });

  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status}`);
  }

  const data: UnsplashSearchResult = await res.json();
  return {
    photos: data.results,
    totalPages: data.total_pages,
  };
}

/**
 * Trigger an Unsplash download event.
 * Required by the Unsplash API guidelines — call this when a photo is used.
 */
export async function trackDownload(photo: UnsplashPhoto): Promise<void> {
  const key = getApiKey();
  if (!key) return;

  // The download endpoint is at the photo's download location
  try {
    await fetch(`${API_BASE}/photos/${photo.id}/download`, {
      headers: { Authorization: `Client-ID ${key}` },
    });
  } catch {
    // Non-critical — don't block the user
  }
}
