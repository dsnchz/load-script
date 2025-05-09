export type Blocking = "render" | "media" | "document" | (string & {});

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/crossOrigin
export type CrossOrigin = "anonymous" | "use-credentials" | "";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/fetchPriority
export type FetchPriority = "auto" | "high" | "low";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/referrerPolicy
export type ReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/type
export type ScriptType =
  | "text/javascript"
  | "module"
  | "application/ld+json"
  | "importmap"
  | "text/json"
  | "";
