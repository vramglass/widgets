# VRAMGlass Widgets

Integration tools for [VRAMGlass hosted GPU price widgets](https://vramglass.com/widget), maintained by [voltwake](https://github.com/voltwake).

## Install

```sh
npm install @vramglass/widgets
```

## What this package does

Loads the official hosted renderer once and creates configured `<vg-price-card>` elements. Zero runtime dependencies. The rendering code, styles, charts, price collection, database and data feed are not bundled. The card uses the same hosted script as the website configurator; it is not an iframe.

## Run the example

From this directory, run `python3 -m http.server 4387 --bind 127.0.0.1`, then open `http://127.0.0.1:4387/examples/`. The example imports the local SDK and loads the real hosted widget.

```js
import { loadWidgets, createPriceCard } from '@vramglass/widgets';

// Run in the browser after mounting your page, e.g. inside React useEffect.
await loadWidgets();
const card = createPriceCard({ gpu: 'rtx-3090', market: 'ebay', theme: 'auto' });
document.querySelector('#gpu-price').append(card);
// On component teardown: card.remove();
```

The package import is safe during SSR; call its functions in the browser. Catch load failures to show a fallback link. `loadWidgets()` resolves when the custom element is registered, not when price data has finished loading.

## Configuration

| Option | Meaning |
| --- | --- |
| `gpu` | Required device slug, e.g. `rtx-3090`; use the website selector for supported devices |
| `market` | Required: `ebay` or `xianyu` |
| `theme` | `auto` (default), `light`, `dark` |
| `locale` | `en` (default), `zh`, `zh-tw`, `ja` |
| `currency` | Display currency supported by the hosted widget; omitted uses market currency |
| `width` | Width in pixels, 350–1600; omitted fills its container |
| `linkRel` | Optional source-link rel, e.g. `nofollow` |

Optional display values are normalized by the hosted renderer. Update attributes on the returned element to change its configuration. `createPriceCard()` does not load scripts or mount the element. `loadWidgets({ nonce, timeoutMs, document })` accepts a CSP nonce, a positive timeout (default 15 seconds), and an optional browser document. Calls in the same document share one in-flight load; failed SDK-owned script loads can be retried.

## Hosting and limitations

A working network connection to `https://vramglass.com` is required. With a CSP, allow this origin in the relevant script, connect and image directives; a nonce can authorize the loader's script element. The `/widget/v1/` endpoint receives compatible service updates; the npm version does not freeze the hosted renderer. Offline/self-hosted rendering is not provided by this SDK. CMS platforms that block scripts cannot run it.

Prices are market listing references, not completed-sale prices. Review the [methodology](https://vramglass.com/methodology) and card sample count/update time. The service may be rate-limited, unavailable or changed. The SDK contains no price dataset.

## Attribution and licensing

Using the hosted widget/data requires visible VRAMGlass branding and a working source link. Do not remove, cover, crop, replace or redirect it. `nofollow` is allowed; visible attribution remains required. See [TERMS.md](TERMS.md) and [TRADEMARKS.md](TRADEMARKS.md).

The SDK source, types and examples are licensed under [MIT](LICENSE). Hosted-service conditions are separate from this code license; they do not restrict your MIT rights in the SDK itself. Contact [hello@vramglass.com](mailto:hello@vramglass.com) for support or custom/white-label arrangements.

## Development

`npm test` tests loading, retries, SSR behavior and element configuration. `npm run verify:package` checks the exact npm file allowlist. See [CONTRIBUTING.md](CONTRIBUTING.md).
