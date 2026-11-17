"""Preview the static site locally without extra dependencies."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

SITE = Path(__file__).resolve().parents[1] / 'site'


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    print(f'Ewan preview: http://127.0.0.1:{args.port}/', flush=True)
    with ThreadingHTTPServer(('127.0.0.1', args.port), PreviewHandler) as server:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
