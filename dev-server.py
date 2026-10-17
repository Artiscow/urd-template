#!/usr/bin/env python3
"""Local test server for an Urd site.

Serves the folder this file stands in, like `python3 -m http.server`, but
every response is sent with `Cache-Control: no-store`. Without that rule
the browser guesses how long files stay fresh (heuristic caching), and the
preview's engine and plugin files (the ES module imports in the iframe)
linger even across a hard reload. With this server a plain reload always
holds.

Run from the site's folder (in the Urd repo, `python3 dev-server.py` from
the repo root starts this file too):

    python3 dev-server.py          # port 8000
    python3 dev-server.py 8123     # optional port
"""

import contextlib
import errno
import functools
import http.server
import os
import socket
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    # HTTP/1.1 with keep-alive: faster than 1.0 during the engine's
    # module loading storm (one connection per file otherwise).
    protocol_version = 'HTTP/1.1'

    # Conditional requests are stripped BEFORE send_head: otherwise
    # SimpleHTTPRequestHandler answers "304 Not Modified" to
    # If-Modified-Since and the browser keeps its stale copy. Without
    # these headers a fresh 200 is always sent.
    def _strip_conditional(self):
        for header in ('If-Modified-Since', 'If-None-Match', 'If-Range'):
            while header in self.headers:
                del self.headers[header]

    def do_GET(self):
        self._strip_conditional()
        super().do_GET()

    def do_HEAD(self):
        self._strip_conditional()
        super().do_HEAD()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


class DualStackServer(http.server.ThreadingHTTPServer):
    # Same binding as `python3 -m http.server`: IPv6 and IPv4 at once,
    # since browsers tend to try ::1 first for localhost.
    address_family = socket.AF_INET6

    def server_bind(self):
        with contextlib.suppress(Exception):
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = os.path.dirname(os.path.abspath(__file__))
    handler = functools.partial(NoCacheHandler, directory=root)
    try:
        try:
            server = DualStackServer(('::', port), handler)
        except OSError as err:
            if err.errno == errno.EADDRINUSE:
                raise
            # IPv6 unavailable on this machine: fall back to plain IPv4.
            server = http.server.ThreadingHTTPServer(('0.0.0.0', port), handler)
    except OSError as err:
        if err.errno == errno.EADDRINUSE:
            print(f'Port {port} is busy (is another server still running?).')
            print(f'Stop it, or pick another port: python3 dev-server.py {port + 1}')
            sys.exit(1)
        raise
    with server:
        print(f'Urd test server: http://localhost:{port} (serving {root}, caching off)', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nStopped.')


if __name__ == '__main__':
    main()
