"""Create the Hostinger and brand bundles from the current source."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from zipfile import ZIP_DEFLATED, ZipFile

PROJECT = Path(__file__).resolve().parents[1]


class LocalReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in ('src', 'srcset', 'href') or not value:
                continue
            path = urlsplit(value.split()[0])
            if path.path and not path.scheme and not path.netloc:
                self.paths.append(path.path)


def package(folder, filename, entry):
    source = PROJECT / folder
    files = [p for p in sorted(source.rglob('*')) if p.is_file()
             and not any(part.startswith('.') for part in p.relative_to(source).parts)]
    target = PROJECT / filename
    temporary = target.with_suffix('.zip.tmp')
    with ZipFile(temporary, 'w', ZIP_DEFLATED, compresslevel=8) as archive:
        for file in files:
            archive.write(file, file.relative_to(source).as_posix())
    with ZipFile(temporary) as archive:
        if archive.testzip() is not None or entry not in archive.namelist():
            raise ValueError(f'Invalid archive: {filename}')
        names = set(archive.namelist())
        for page in (p for p in files if p.suffix == '.html'):
            parser = LocalReferences()
            parser.feed(page.read_text(encoding='utf-8'))
            for reference in parser.paths:
                asset = (page.parent / reference).resolve().relative_to(source.resolve()).as_posix()
                if asset not in names:
                    raise ValueError(f'Missing asset in {filename}: {asset}')
    temporary.replace(target)
    print(f'{filename}: {len(files)} files, {target.stat().st_size} bytes')


if __name__ == '__main__':
    package('site', 'ewan-hostinger.zip', 'index.html')
    package('brand', 'ewan-brand.zip', 'brand-guide.html')
