---
description: Workflow to update changes on npm
---

Use this workflow to upload code changes on npm: 

```
\\turbo-all

npm run build && \
npm version patch --no-git-tag-version --force && \
git add . && \
git commit -m "chore: release nova versão" && \
git push && \
npm publish

```