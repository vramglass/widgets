export declare const SCRIPT_URL: 'https://vramglass.com/widget/v1/price-card.js';
export declare const ELEMENT_TAG: 'vg-price-card';
export interface LoadOptions { document?: Document; nonce?: string; timeoutMs?: number; }
export interface PriceCardOptions {
  gpu: string;
  market: 'ebay' | 'xianyu';
  currency?: string;
  locale?: 'en' | 'zh' | 'zh-tw' | 'ja';
  theme?: 'auto' | 'light' | 'dark';
  /** Container width in pixels; hosted renderer supports 350–1600. */
  width?: number;
  /** Optional source-link rel value, for example nofollow. */
  linkRel?: string;
}
export declare function loadWidgets(options?: LoadOptions): Promise<void>;
export declare function createPriceCard(options: PriceCardOptions, document?: Document): HTMLElement;
