# delete-vercel-preview-urls

※ This project is experimental.

GitHub Actions to delete Vercel Preview URLs if remote branch is deleted.

## Motivation

Vercel Preview URLs remains even if the git branch which is associated with them was deleted.

It is a problem when you published Preview URLs to external teams.

This action deletes active Preview URLs to resolve it.
