#!/usr/bin/env python3
"""Local test server for an Urd site.

Serves the folder this file stands in, like `python3 -m http.server`, but
every response is sent with `Cache-Control: no-store`. Without that rule
the browser guesses how long files stay fresh (heuristic caching), and the
preview's engine and plugin files (the ES module imports in the iframe)
linger even across a hard reload. With this server a plain reload always
holds.

It answers this machine only (localhost), and never a path segment that starts with a dot, since the site's secrets (.dev.vars) and the repository (.git/) stand in the same folder.
--lan shares it on the network, for a phone on the same Wi-Fi.

Run from the site's folder (in the Urd repo, `python3 dev-server.py` from
the repo root starts this file too):

    python3 dev-server.py          # port 8000
    python3 dev-server.py 8123     # optional port
    python3 dev-server.py --lan    # shared on the network
"""

import contextlib
import errno
import functools
import http.server
import os
import socket
import sys
import threading
import urllib.parse

# The names this machine answers to when the server is not shared.
LOCAL_HOSTS = ('localhost', '127.0.0.1', '[::1]')


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

    # Whether the server is shared on the network (--lan): then any Host header is answered, else only this machine's names, so a page elsewhere cannot reach it under a name of its own (DNS rebinding).
    lan = False

    def _refused(self):
        host = (self.headers.get('Host') or '').lower()
        host = host[:host.index(']') + 1] if host.startswith('[') and ']' in host else host.split(':')[0]
        if not self.lan and host not in LOCAL_HOSTS:
            self.send_error(403, 'Open the site as localhost')
            return True
        # A segment that starts with a dot holds secrets or tooling (.dev.vars, .git/, .wrangler/), never the site.
        path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
        if any(part.startswith('.') for part in path.replace('\\', '/').split('/') if part):
            self.send_error(404)
            return True
        return False

    def do_GET(self):
        if self._refused():
            return
        self._strip_conditional()
        super().do_GET()

    def do_HEAD(self):
        if self._refused():
            return
        self._strip_conditional()
        super().do_HEAD()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


class DualStackServer(http.server.ThreadingHTTPServer):
    # Shared on the network (--lan): IPv6 and IPv4 on every interface at once, as `python3 -m http.server` binds.
    address_family = socket.AF_INET6

    def server_bind(self):
        with contextlib.suppress(Exception):
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()


class LoopbackV6Server(http.server.ThreadingHTTPServer):
    # This machine's IPv6 name (::1), beside 127.0.0.1, since browsers try either for localhost.
    address_family = socket.AF_INET6


def main():
    args = sys.argv[1:]
    lan = '--lan' in args
    numbers = [a for a in args if not a.startswith('--')]
    port = int(numbers[0]) if numbers else 8000
    root = os.path.dirname(os.path.abspath(__file__))
    NoCacheHandler.lan = lan
    handler = functools.partial(NoCacheHandler, directory=root)
    servers = []
    try:
        if lan:
            try:
                servers.append(DualStackServer(('::', port), handler))
            except OSError as err:
                if err.errno == errno.EADDRINUSE:
                    raise
                # IPv6 unavailable on this machine: fall back to plain IPv4.
                servers.append(http.server.ThreadingHTTPServer(('0.0.0.0', port), handler))
        else:
            servers.append(http.server.ThreadingHTTPServer(('127.0.0.1', port), handler))
            try:
                servers.append(LoopbackV6Server(('::1', port), handler))
            except OSError as err:
                if err.errno == errno.EADDRINUSE:
                    raise
                # No IPv6 on this machine: localhost reaches 127.0.0.1.
    except OSError as err:
        for server in servers:
            server.server_close()
        if err.errno == errno.EADDRINUSE:
            print(f'Port {port} is busy (is another server still running?).')
            print(f'Stop it, or pick another port: python3 dev-server.py {port + 1}')
            sys.exit(1)
        raise
    for extra in servers[1:]:
        threading.Thread(target=extra.serve_forever, daemon=True).start()
    if lan:
        print(f'Urd test server: http://localhost:{port} (serving {root}, caching off, SHARED on the network: anyone on it can open the site)', flush=True)
    else:
        print(f'Urd test server: http://localhost:{port} (serving {root}, caching off, this machine only; --lan shares it)', flush=True)
    try:
        servers[0].serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
    finally:
        for extra in servers[1:]:
            extra.shutdown()
        for server in servers:
            server.server_close()


if __name__ == '__main__':
    main()
