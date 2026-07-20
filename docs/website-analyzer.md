# Website Analyzer

Execution remains disabled pending owner, legal, cost, and public-availability approval. The UI does not accept or fetch URLs in disabled mode.

The prepared server boundary permits only HTTP/HTTPS, conventional ports, no URL credentials, and a 2,048-character maximum. It blocks localhost/internal suffixes and private, loopback, link-local, carrier-grade NAT, benchmarking, multicast, and IPv4-mapped/private IPv6 ranges. Every hostname is resolved before each request; any private answer blocks the request. Redirects are manual, capped at three, reparsed, and re-resolved, mitigating redirects and DNS rebinding toward private networks.

Fetches use an eight-second timeout, one-megabyte streaming cap, HTML-only content types, a declared user agent, no cookies, no visitor headers, no credentials, no JavaScript, and no browser automation. Only a submitted public homepage is in scope. Fetched HTML must be treated as hostile, never logged, executed, or permanently retained.

Before public execution, add an explicit ownership/authorization checkbox with legally approved wording, HTML parsing/evidence extraction tests, redirect integration fixtures, concurrency control, robots handling, and hosted egress verification. Until those are complete, the analyzer must remain disabled.
