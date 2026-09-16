/** Official hosted widget loader. Importing this module is safe during SSR. */
export const SCRIPT_URL = 'https://vramglass.com/widget/v1/price-card.js';
export const ELEMENT_TAG = 'vg-price-card';
const pending = new WeakMap();

/** Load the hosted renderer once per document. Resolves when the element is defined. */
export function loadWidgets({ document: doc = globalThis.document, nonce, timeoutMs = 15000 } = {}) {
  const registry = doc?.defaultView?.customElements;
  if (!registry || !doc.head) return Promise.reject(new Error('loadWidgets requires a browser document.'));
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return Promise.reject(new Error('timeoutMs must be positive.'));
  if (registry.get(ELEMENT_TAG)) return Promise.resolve();
  if (pending.has(doc)) return pending.get(doc);
  const promise = new Promise((resolve, reject) => {
    let script = Array.from(doc.scripts).find(item => item.src === SCRIPT_URL);
    const owned = !script;
    if (!script) {
      script = doc.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      if (nonce) script.nonce = nonce;
    }
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.removeEventListener('error', onError);
      if (error) {
        if (owned) script.remove();
        reject(error);
      } else resolve();
    };
    const onError = () => finish(new Error('Unable to load the VRAMGlass widget script.'));
    const timer = setTimeout(() => finish(new Error('VRAMGlass widget loading timed out.')), timeoutMs);
    script.addEventListener('error', onError, { once: true });
    registry.whenDefined(ELEMENT_TAG).then(() => finish(), finish);
    if (owned) {
      try { doc.head.append(script); } catch (error) { finish(error); }
    }
  });
  pending.set(doc, promise);
  promise.then(() => pending.delete(doc), () => pending.delete(doc));
  return promise;
}

/** Create a configured element without mounting it or making network requests. */
export function createPriceCard(options, doc = globalThis.document) {
  if (!doc?.createElement) throw new Error('createPriceCard requires a browser document.');
  if (!options || !/^[a-z0-9-]{1,64}$/.test(options.gpu ?? '')) throw new Error('A GPU slug is required.');
  if (!['ebay', 'xianyu'].includes(options.market)) throw new Error('market must be ebay or xianyu.');
  const card = doc.createElement(ELEMENT_TAG);
  const fields = { gpu: 'gpu', market: 'market', currency: 'currency', locale: 'locale', theme: 'theme', width: 'width', linkRel: 'link-rel' };
  for (const [key, attribute] of Object.entries(fields)) {
    if (options[key] != null) card.setAttribute(attribute, String(options[key]));
  }
  return card;
}
