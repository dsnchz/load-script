import { beforeEach, describe, expect, test, vi } from "vitest";

import { __resetScriptCache, loadScript, type LoadScriptOptions } from "../loadScript";

const SCRIPT_SRC = "https://example.com/script.js";

describe("loadScript", () => {
  beforeEach(() => {
    document.querySelectorAll("script").forEach((s) => s.remove());
    __resetScriptCache();
  });

  test("rejects when not in a browser environment", async () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;

    Object.defineProperty(globalThis, "window", {
      value: undefined,
      writable: false,
    });
    Object.defineProperty(globalThis, "document", {
      value: undefined,
      writable: false,
    });

    const promise = loadScript("https://cdn.example.com/test.js");

    await expect(promise).rejects.toThrow("loadScript can only be used in the browser");

    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      writable: false,
    });
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      writable: false,
    });
  });

  test("rejects if src is not provided", async () => {
    await expect(loadScript("")).rejects.toThrow('No "src" provided to loadScript');
  });

  test("assigns all direct script properties correctly", async () => {
    const props = {
      async: false,
      defer: true,
      fetchPriority: "low",
      noModule: true,
      id: "test-script",
      type: "text/javascript",
      crossOrigin: "anonymous",
      referrerPolicy: "origin",
      integrity: "sha384-abc123",
      nonce: "xyz123",
      textContent: "Hello, world!",
    } as LoadScriptOptions;

    const promise = loadScript(SCRIPT_SRC, props);

    const [script] = document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`);
    expect(script).toBeDefined();

    script?.dispatchEvent(new Event("load"));
    const resolved = await promise;

    expect(resolved.async).toBe(false);
    expect(resolved.id).toBe("test-script");
    expect(resolved.defer).toBe(true);
    expect(resolved.fetchPriority).toBe("low");
    expect(resolved.noModule).toBe(true);
    expect(resolved.type).toBe("text/javascript");
    expect(resolved.crossOrigin).toBe("anonymous");
    expect(resolved.referrerPolicy).toBe("origin");
    expect(resolved.integrity).toBe("sha384-abc123");
    expect(resolved.nonce).toBe("xyz123");
    expect(resolved.textContent).toBe("Hello, world!");
  });

  test("applies additional script attributes via setAttribute", async () => {
    const promise = loadScript(SCRIPT_SRC, { "data-id": "custom-script-id" });

    const [script] = document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`);
    expect(script).toBeDefined();

    script?.dispatchEvent(new Event("load"));
    const resolved = await promise;

    expect(resolved.getAttribute("data-id")).toBe("custom-script-id");
  });

  test("resolves immediately if script already exists in DOM", async () => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);

    const resolved = await loadScript(SCRIPT_SRC);
    expect(resolved).toBe(script);
  });

  test("injects script only once per src when innerHTML is not set", async () => {
    const promise1 = loadScript(SCRIPT_SRC, { async: true });
    const promise2 = loadScript(SCRIPT_SRC, { async: true });

    const scripts = document.querySelectorAll(`script[src='${SCRIPT_SRC}']`);
    expect(scripts.length).toBe(1);

    scripts[0]?.dispatchEvent(new Event("load"));

    const s1 = await promise1;
    const s2 = await promise2;

    expect(s1).toBe(s2);
  });

  test("injects script multiple times when different innerHTML is set", async () => {
    const promise1 = loadScript(SCRIPT_SRC, {
      innerHTML: `{ "symbol": "AAPL" }`,
    });
    const promise2 = loadScript(SCRIPT_SRC, {
      innerHTML: `{ "symbol": "TSLA" }`,
    });

    const scripts = document.querySelectorAll(`script[src='${SCRIPT_SRC}']`);
    expect(scripts.length).toBe(2);

    scripts[0]?.dispatchEvent(new Event("load"));
    scripts[1]?.dispatchEvent(new Event("load"));

    const s1 = await promise1;
    const s2 = await promise2;

    expect(s1).not.toBe(s2);
  });

  test("evicts stale cache when script was removed from DOM", async () => {
    const promise1 = loadScript(SCRIPT_SRC);
    const script1 = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;
    script1.dispatchEvent(new Event("load"));

    const resolved1 = await promise1;
    expect(resolved1).toBe(script1);

    // Simulate user removing the script from the DOM
    script1.remove();

    // Second load: should not return the same script, should re-inject
    const promise2 = loadScript(SCRIPT_SRC);
    const script2 = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;

    // Manually resolve the second injected script
    script2.dispatchEvent(new Event("load"));
    const resolved2 = await promise2;

    expect(resolved2).not.toBe(resolved1);
  });

  test("falls back to document.head when container is null", async () => {
    const promise = loadScript(SCRIPT_SRC, { async: true }, null);

    const script = document.querySelector(`head script[src="${SCRIPT_SRC}"]`);
    expect(script).toBeDefined();

    script?.dispatchEvent(new Event("load"));
    const resolved = await promise;

    expect(document.head.contains(resolved)).toBe(true);
  });

  test("resolves when script loads", async () => {
    const promise = loadScript(SCRIPT_SRC);
    const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;

    script.dispatchEvent(new Event("load"));

    const resolved = await promise;
    expect(resolved).toBe(script);
  });

  test("rejects when script fails to load", async () => {
    const promise = loadScript(SCRIPT_SRC);
    const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;

    const errorEvent = new Event("error");

    script.dispatchEvent(errorEvent);

    await expect(promise).rejects.toBe(errorEvent);
  });

  test("calls onLoad handler when provided after script loads", async () => {
    const onLoad = vi.fn();

    const promise = loadScript(SCRIPT_SRC, { onLoad });
    const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;

    script.dispatchEvent(new Event("load"));

    const resolved = await promise;

    expect(onLoad).toHaveBeenCalledOnce();
    expect(resolved).toBe(script);
  });

  test("calls onError handler when script fails to load", async () => {
    const onError = vi.fn();

    const promise = loadScript(SCRIPT_SRC, { onError });

    const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`)!;

    const errorEvent = new Event("error");

    script.dispatchEvent(errorEvent);

    await expect(promise).rejects.toBe(errorEvent);

    expect(onError).toHaveBeenCalledOnce();
  });
});
