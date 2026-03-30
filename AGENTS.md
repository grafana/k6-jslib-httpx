# k6-jslib-httpx

Session-based HTTP client wrapper for k6 that adds baseURL, default headers/tags, and error metric tracking on top of k6's built-in HTTP module.

## Architecture

Single source file, no build step, no package manager. Tests are k6 scripts that run against live endpoints -- they cannot run in Node or a unit test runner.

The session object holds default headers, tags, and a baseURL. Every request merges per-call params on top of session-level defaults via a two-level merge. The merge is shallow for top-level keys but explicitly deep-merges headers and tags so both layers combine rather than replace.

Data flow: caller -> session param merge -> k6 http.request/http.asyncRequest -> post-request hook (error metric + timing). The post-request hook records the last response and chain duration on the session for caller inspection.

Batch requests always prepend baseURL to every element. They bypass the per-request error-metric hook and instead record the entire batch response array as lastRequest.

## Gotchas

- `batch` always prepends baseURL even for absolute URLs. This differs from individual requests, which skip prepending when the URL starts with "http". Passing absolute URLs into batch produces double-prefixed broken URLs.
- `asyncRequest` does NOT run the post-request hook (no error metric, no lastRequest update). Only sync `request` does. Easy to miss since async helpers look like mirrors of the sync ones.
- The constructor destructures known keys from opts then assigns the leftover opts object as extra k6 params. It mutates the caller's original opts via `delete`, so re-using that object will be missing keys.
- Per-request headers/tags merge additively with session defaults. There is no way to suppress a session-level header for a single request -- you can only override its value, not remove it.
