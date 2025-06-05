# @dschz/load-script

## 1.0.9

### Patch Changes

- Adds JSR score badge to readme

## 1.0.8

### Patch Changes

- updates readme badges

## 1.0.7

### Patch Changes

- updates readme documentation

## 1.0.6

### Patch Changes

- **🛡️ SSR Safety**: Safe to import and use in server-side rendering and non-browser environments with graceful error handling

## 1.0.5

### Patch Changes

- Updates package keywords to improve discoverability

## 1.0.4

### Patch Changes

- adds handling of null container value which defaults to document.head

## 1.0.3

### Patch Changes

- Updates publishing script

## 1.0.2

### Patch Changes

- updates jsdoc comments

## 1.0.1

### Patch Changes

- Adds return type signature for JSR compliance

## 1.0.0

**Initial Release**: Complete utility function for dynamically loading external scripts into the browser with advanced features and safety guarantees.

### Features

- **🔄 Smart Caching**: Prevents duplicate script injection via intelligent in-memory caching by script `src` URL
- **⚡ Framework Agnostic**: Works with any JavaScript framework or vanilla JS applications
- **📝 Full TypeScript Support**: Comprehensive type definitions with intellisense and autocomplete support
- **🎯 Flexible Script Attributes**: Support for all standard HTML script attributes including:
  - `async` and `defer` execution modes
  - `type` specification (text/javascript, module, importmap, etc.)
  - `integrity` for subresource integrity verification
  - `nonce` for Content Security Policy compliance
  - `crossOrigin` and `referrerPolicy` for CORS handling
  - `fetchPriority` for resource loading optimization
  - Custom `data-*` attributes support

### Technical Details

- **DOM Integration**: Flexible container targeting with fallback to `document.head`
- **Promise-Based API**: Async/await compatible with proper error handling
- **Event Handling**: Built-in `onLoad` and `onError` callback support
- **Content Injection**: Support for both `innerHTML` and `textContent` with security considerations
- **Cache Management**: Automatic cache invalidation when scripts are removed from DOM
- **Type Safety**: Comprehensive TypeScript definitions for all HTML script element properties

### API

- `loadScript(src, options?, container?)` - Main function returning `Promise<HTMLScriptElement>`
- `LoadScriptOptions` - Comprehensive options interface with full HTML script attribute support
- Built-in type definitions for `CrossOrigin`, `FetchPriority`, `ReferrerPolicy`, and `ScriptType`
