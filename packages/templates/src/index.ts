/**
 * @monet/templates — Template definitions and registry.
 *
 * Templates are pre-made designs that users can pick and customize.
 * Each template is a DesignDocument with extra metadata (category, tags, thumbnail).
 */

export type { Template } from './types';
export { TEMPLATE_REGISTRY, getTemplateCategories, getTemplatesByCategory } from './registry';
