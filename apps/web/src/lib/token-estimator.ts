/**
 * Token Estimator — rough cost estimation for Anthropic API calls.
 *
 * Uses character count as a proxy for token count (~4 chars per token
 * for English text, ~3 for JSON). Displays estimated and actual costs
 * using Claude Sonnet pricing.
 *
 * Pricing: Claude Sonnet — $3/M input tokens, $15/M output tokens.
 */

const INPUT_PRICE_PER_M = 3;
const OUTPUT_PRICE_PER_M = 15;

/**
 * Roughly estimate the number of tokens in a string.
 * English text: ~4 chars/token. JSON/code: ~3 chars/token.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  const charsPerToken = /^\s*[\[{]/.test(text) ? 3 : 4;
  return Math.ceil(text.length / charsPerToken);
}

/** Calculate cost in USD from token counts. */
export function estimateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * INPUT_PRICE_PER_M + outputTokens * OUTPUT_PRICE_PER_M) / 1_000_000;
}

/** Format a cost for display: "~$0.02" or "<$0.01". */
export function formatCost(cost: number): string {
  if (cost < 0.005) return '<$0.01';
  return `~$${cost.toFixed(2)}`;
}

/**
 * Estimate the cost of an API call before sending.
 * @returns Formatted cost estimate like "~$0.03"
 */
export function estimateCallCost(
  systemPrompt: string,
  userContent: string,
  expectedOutputTokens: number = 1000,
): string {
  const inputTokens = estimateTokens(systemPrompt) + estimateTokens(userContent);
  return formatCost(estimateCost(inputTokens, expectedOutputTokens));
}

/**
 * Format actual token usage after API call completion.
 * @returns "Used ~1,200 tokens ($0.02)"
 */
export function formatUsage(inputTokens: number, outputTokens: number): string {
  const total = inputTokens + outputTokens;
  const cost = estimateCost(inputTokens, outputTokens);
  return `Used ~${total.toLocaleString()} tokens (${formatCost(cost)})`;
}
