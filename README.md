# @dschz/load-script

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@dschz/load-script?color=blue)](https://www.npmjs.com/package/@dschz/load-script)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@dschz/load-script)](https://bundlephobia.com/package/@dschz/load-script)
[![JSR](https://jsr.io/badges/@dschz/load-script/score)](https://jsr.io/@dschz/load-script)
[![CI](https://github.com/dsnchz/load-script/actions/workflows/ci.yaml/badge.svg)](https://github.com/dsnchz/load-script/actions/workflows/ci.yaml)

> A lightweight utility for safely loading external scripts in the browser. Fully typed, SSR-aware, framework-agnostic, and caching-safe — ideal for modern web apps and libraries.

## ✅ Features

- 📆 Small and framework-agnostic
- 📑 Fully typed with TypeScript for autocompletion and safety
- 🚫 Prevents duplicate script injection via internal cache
- 🛡️ Safe to import and use in SSR and non-browser environments

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

## 📝 Notes

- Scripts are cached by `src`. If `innerHTML` or `textContent` is set, the script will not be cached.
- A nil (`undefined`/`null`) container value will append the script to `document.head`.
- Cleanup is not automatic — script elements remain in the DOM
- ❄️ SSR-safe: The function will reject gracefully when called in server environments without crashing. No DOM APIs are accessed until the environment is confirmed to be browser-based.

## 💬 Feedback & Contributions

Feel free to open [issues](https://github.com/dsnchz/load-script/issues) or submit pull requests. PRs are welcome!
