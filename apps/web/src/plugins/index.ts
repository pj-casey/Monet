/**
 * Built-in Plugins — registered automatically on app startup.
 *
 * Each plugin provides a panel in the Plugins sidebar section.
 * The pluginManager handles initialization and lifecycle.
 */

import { pluginManager } from '../lib/plugin-manager';
import { qrCodePlugin } from './qr-code';
import { loremIpsumPlugin } from './lorem-ipsum';
import { chartWidgetPlugin } from './chart-widget';

/** Register all built-in plugins */
export function registerBuiltinPlugins(): void {
  pluginManager.register(qrCodePlugin);
  pluginManager.register(loremIpsumPlugin);
  pluginManager.register(chartWidgetPlugin);
}
