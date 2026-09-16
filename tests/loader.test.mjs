import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadWidgets, createPriceCard, SCRIPT_URL } from '../src/index.js';
function fixture() {
  const scripts = []; let define; let ready = false;
  const defined = new Promise(resolve => { define = () => { ready = true; resolve(); }; });
  const doc = { scripts, defaultView: { customElements: { get: () => ready, whenDefined: () => defined } },
    head: { append: item => scripts.push(item) },
    createElement: tag => { const el = new EventTarget(); el.tag = tag; el.attrs = {}; el.setAttribute = (key,value) => el.attrs[key] = value; el.remove = () => { const i = scripts.indexOf(el); if (i >= 0) scripts.splice(i,1); }; return el; }
  };
  return { doc, define };
}
test('SSR import has no DOM side effects; browser calls fail clearly', async () => {
  await assert.rejects(loadWidgets(), /browser document/);
  assert.throws(() => createPriceCard({ gpu:'rtx-3090', market:'ebay' }), /browser document/);
});
test('concurrent loads share one script and preserve CSP nonce', async () => {
  const {doc,define} = fixture();
  const a = loadWidgets({document:doc,nonce:'csp-nonce'}), b = loadWidgets({document:doc});
  assert.equal(a,b); assert.equal(doc.scripts.length,1); assert.equal(doc.scripts[0].src,SCRIPT_URL); assert.equal(doc.scripts[0].nonce,'csp-nonce');
  define(); await a; await loadWidgets({document:doc}); assert.equal(doc.scripts.length,1);
});
test('failed loads remove owned script and allow retry', async () => {
  const {doc,define} = fixture(); const first = loadWidgets({document:doc});
  doc.scripts[0].dispatchEvent(new Event('error'));
  await assert.rejects(first,/Unable/); assert.equal(doc.scripts.length,0);
  const retry = loadWidgets({document:doc}); define(); await retry;
});
test('existing host script is reused and never removed on timeout', async () => {
  const {doc} = fixture(); const script = doc.createElement('script'); script.src = SCRIPT_URL; doc.scripts.push(script);
  await assert.rejects(loadWidgets({document:doc,timeoutMs:5}),/timed out/);
  assert.equal(doc.scripts.length,1);
});
test('configured elements remain unmounted and ignore unsupported attributes', () => {
  const {doc} = fixture(); const el = createPriceCard({gpu:'rtx-3090',market:'ebay',theme:'dark',linkRel:'nofollow',onclick:'bad'},doc);
  assert.equal(el.tag,'vg-price-card'); assert.equal(el.attrs['link-rel'],'nofollow'); assert.equal(el.attrs.onclick,undefined); assert.equal(doc.scripts.length,0);
  assert.throws(() => createPriceCard({gpu:'<script>',market:'ebay'},doc),/slug/);
});
