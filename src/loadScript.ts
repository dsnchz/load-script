import type { Blocking, CrossOrigin, FetchPriority, ReferrerPolicy, ScriptType } from "./types";

/**
 * Options for loading a script.
 *
 * @see {@link loadScript}
 */
export type LoadScriptOptions = {
  /** Optional ID for DOM targeting or deduplication */
  readonly id?: string;

  /** Whether the script should execute asynchronously (default: `true`) */
  readonly async?: boolean;

  /** Whether the script should defer execution until after the document has parsed (default: `false`) */
  readonly defer?: boolean;

  /** Prevents the script from being executed in modules if true (default: `false`) */
  readonly noModule?: boolean;

  /** Subresource integrity hash for verifying the fetched script */
  readonly integrity?: string;

  /** CSP nonce for allowing script execution under Content-Security-Policy */
  readonly nonce?: string;

  /** Experimental: Instructs browser blocking behavior (e.g. "render") */
  readonly blocking?: Blocking;

  /** The MIME type of the script (default: `"text/javascript"`) */
  readonly type?: ScriptType;

  /** Specifies the referrer policy for fetching the script */
  readonly referrerPolicy?: ReferrerPolicy;

  /** Indicates the relative fetch priority of the script */
  readonly fetchPriority?: FetchPriority;

  /** Indicates whether to send a cross-origin request and how to handle it */
  readonly crossOrigin?: CrossOrigin;

  /**
   * Content to be inserted into the script as raw HTML (use with caution)
   *
   * Prefer using `textContent` over `innerHTML` to avoid security risks and maintain CSP compatibility.
   */
  readonly innerHTML?: string;

  /** Plain text content to be inserted into the script */
  readonly textContent?: string | null;

  /** Any additional data-* attributes to apply to the script element */
  readonly [key: `data-${string}`]: string | boolean | undefined;

  /** Called when the script successfully loads */
  readonly onLoad?: (e: Event) => void;

  /** Called when the script fails to load or errors */
  readonly onError?: (e: string | Event) => void;
};

// Promise cache for script sources
const SCRIPT_CACHE = new Map<string, Promise<HTMLScriptElement>>();

export const __resetScriptCache = () => {
  SCRIPT_CACHE.clear();
};

/**
 * Loads a script into the DOM and returns a Promise that resolves to the HTMLScriptElement.
 * This is a low-level API that gives you full control over when and where the script is appended.
 *
 * This method is safe against duplicate script injection — it caches by `src` and avoids injecting the same script twice.
 * If the script already exists in the DOM, it resolves immediately with the existing element.
 *
 * @example
 * ```ts
 * const script = await loadScript("https://example.com/library.js", { type: "module" }, document.head);
 * console.log("Script loaded:", script.src);
 * ```
 *
 * @param src - The script URL to load.
 * @param options - additional options for the script (e.g. async, type, textContent).
 * @param target - Optional DOM element to append the script to (defaults to `document.head`).
 * @returns A Promise that resolves to the script element.
 */

export const loadScript = async (
  src: string,
  options: LoadScriptOptions = {},
  target: HTMLElement = document.head,
): Promise<HTMLScriptElement> => {
  const {
    id,
    async = true,
    defer = false,
    noModule = false,
    textContent = null,
    fetchPriority = "auto" as FetchPriority,
    type = "text/javascript" as ScriptType,
    innerHTML,
    crossOrigin,
    referrerPolicy,
    integrity,
    nonce,
    onLoad = () => {},
    onError = () => {},
    ...attributes
  } = options;

  // 1. Reject if no src provided
  if (!src) return Promise.reject(new Error('No "src" provided to loadScript'));

  // We strictly consider scripts with innerHTML as non-cacheable, since they are not guaranteed to be idempotent.
  // Note: We intentionally ignore Solid reactivity here, since this logic is static and not part of a reactive execution context.
  const cacheable = !innerHTML && !textContent;

  if (cacheable) {
    // As much as I would like to optimize here by only doing an in-memory cache checkk, safety needs
    // to come first. We always have to check if the script is in the DOM. The reason for this
    // is that we need to ensure that the cache never goes stale as the user could have removed
    // the script from the DOM but we still have the promise for it cached.
    const existingTag = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    // 2. Check if script already exists in cache
    if (SCRIPT_CACHE.has(src)) {
      // 2a. If script exists in cache and is still in the DOM, return the cached promise
      if (document.contains(existingTag)) return SCRIPT_CACHE.get(src)!;

      // 2b. Script element was removed from DOM — evict from cache
      SCRIPT_CACHE.delete(src);
    }

    // 3. Check if script already exists (may have been added externally not via this hook)
    if (existingTag) return Promise.resolve(existingTag);
  }

  // 4. Create new script element
  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement("script");

    target.appendChild(script);

    script.src = src;
    script.type = type;
    script.fetchPriority = fetchPriority;
    script.async = async;
    script.defer = defer;
    script.noModule = noModule;
    script.textContent = textContent;

    if (id) script.id = id;
    if (innerHTML) script.innerHTML = innerHTML;
    if (crossOrigin) script.crossOrigin = crossOrigin;
    if (referrerPolicy) script.referrerPolicy = referrerPolicy;
    if (integrity) script.integrity = integrity;
    if (nonce) script.nonce = nonce;

    script.onload = (e) => {
      onLoad?.(e);
      resolve(script);
    };

    script.onerror = (e) => {
      onError?.(e);
      reject(e);
    };

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, String(value));
    });
  });

  if (cacheable) SCRIPT_CACHE.set(src, promise);

  return promise;
};
