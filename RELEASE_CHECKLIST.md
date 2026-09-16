# Release checklist

- Run `npm test` and `npm run verify:package`.
- Test the plain HTML example with the official hosted renderer.
- Verify clean tarball installation and SSR import.
- Confirm version, changelog, repository URL and npm metadata agree.
- Inspect the exact packed file list. Include only SDK code/types and public documentation; never include the hosted renderer, collection pipeline, site source, credentials or datasets.
- Publish the reviewed source and npm package, then verify the public version and installation.
