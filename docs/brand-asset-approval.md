# Brand asset approval

Current technical assets are functional; final brand approval remains an owner decision.

| Asset            | Current file                                  | Approval question                                    |
| ---------------- | --------------------------------------------- | ---------------------------------------------------- |
| Browser icon     | `public/icon.svg` and generated icon metadata | Is this the final approved favicon at small sizes?   |
| Apple touch icon | `src/app/apple-icon.tsx`                      | Is the mark/background approved on iOS home screens? |
| Open Graph image | `src/app/opengraph-image.tsx`                 | Is the copy, mark, contrast, and crop approved?      |
| Twitter image    | `src/app/twitter-image.tsx`                   | Is the shared social-card treatment approved?        |

If replacements are supplied, require documented ownership/licensing, keep source files outside Git if sensitive, export appropriate dimensions, preserve accessible contrast, and verify crops using metadata previews. Do not add unverified awards, partner logos, client marks, or certification badges.
