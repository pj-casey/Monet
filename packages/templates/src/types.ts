import type { DesignDocument } from '@monet/shared';

/** A template is a pre-made design with metadata for browsing/searching */
export interface Template {
  templateId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  dimensions: { width: number; height: number };
  thumbnail: string;
  document: DesignDocument;
}
