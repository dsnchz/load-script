[![NPM Version](https://img.shields.io/npm/v/@dschz/load-script.svg?style=for-the-badge)](https://www.npmjs.com/package/@dschz/load-script)
[![Build Status](https://img.shields.io/github/actions/workflow/status/dsnchz/load-script/ci.yaml?branch=main&logo=github&style=for-the-badge)](https://github.com/dsnchz/load-script/actions/workflows/ci.yaml)
[![bun](https://img.shields.io/badge/maintained%20with-bun-cc00ff.svg?style=for-the-badge&logo=bun)](https://bun.sh/)

# @dschz/load-script

> Lightweight utility for dynamically loading external scripts into the browser — framework-agnostic, caching-safe, and CSP-friendly.

## 📦 Installation

```bash
npm install @dschz/load-script
pnpm install @dschz/load-script
yarn install @dschz/load-script
bun install @dschz/load-script
```

## 🔧 Usage

```ts
import { loadScript } from "@dschz/load-script";

await loadScript("https://example.com/library.js", {
  async: true,
  type: "text/javascript",
});
```

## 🧠 API

### `loadScript(src, options?, container?)`

Loads an external script dynamically and returns a `Promise<HTMLScriptElement>`.

#### Parameters:

| Name        | Type                | Description                                                       |
| ----------- | ------------------- | ----------------------------------------------------------------- |
| `src`       | `string`            | Script URL (required)                                             |
| `options`   | `LoadScriptOptions` | `loadScript` options (e.g. `async`, `type`)                       |
| `container` | `HTMLElement`       | HTML element to append `<script />` to (default: `document.head`) |

## ✅ Features

- 📑 Fully typed with TypeScript for autocompletion and safety
- 🚫 Prevents duplicate script injection via internal cache
- ⚙️ Supports `data-*`, `nonce`, `fetchPriority`, `crossOrigin`, and other modern attributes
- 📆 Small and framework-agnostic
- 🔒 CSP-friendly via `nonce` support

---

## 🧪 Example: With SolidJS

```ts
import { onMount } from "solid-js";
import { loadScript } from "@dschz/load-script";

const WidgetLoader = () => {
  let containerRef!: HTMLElement;

  onMount(async () => {
    await loadScript("https://example.com/widget.js", {
      type: "text/javascript",
      async: true,
    }, containerRef);
  });

  return <div ref={containerRef} />;
};
```

## 📝 Notes

- Scripts are cached by `src` unless `innerHTML` or `textContent` is used
- A nil (`undefined`/`null`) container value will append the script to `document.head`.
- Cleanup is not automatic — script elements remain in the DOM

---

## 💬 Feedback & Contributions

Feel free to open [issues](https://github.com/dsnchz/load-script/issues) or submit pull requests. PRs are welcome!
