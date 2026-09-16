# Release checklist

- Run `npm test` and `npm run verify:package`.
- Test the plain HTML example with the official hosted renderer.
- Verify clean tarball installation and SSR import.
- Confirm version, changelog, repository URL and npm metadata agree.
- Inspect the exact packed file list. Include only SDK code/types and public documentation; never include the hosted renderer, collection pipeline, site source, credentials or datasets.
- Publish the reviewed source and npm package, then verify the public version and installation.

## 0.1.0 publication — 2026-09-16

- Published [`@vramglass/widgets@0.1.0`](https://www.npmjs.com/package/@vramglass/widgets) to the public npm registry; `latest` is `0.1.0`.
- All five unit tests, TypeScript consumer checks, clean tarball installation and SSR import passed before publication.
- The packed SDK loaded the official hosted renderer in a real browser; light and dark RTX 3090/eBay cards displayed price data, charts and clickable source attribution.
- After publication, a fresh directory and npm cache installed the package from `https://registry.npmjs.org/`. All eight installed files matched the reviewed package byte for byte; SSR and TypeScript imports passed again.
- Registry access is public. Package version, MIT license, repository URL, homepage and rendered npm README were verified.
- Tarball SHA-1: `7364ba223581a6a3aaee7bd80ead5fd733649beb`.
- Tarball integrity: `sha512-6yJTwAJrqdKG9LTGNCutNuL9eVxkrzPcbeWrC8mYkB9BpKPMKAbyceWinVmCiFGLTdBXixfBdbVog75SZZKz2Q==`.
