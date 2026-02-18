"""
Patch mkdocs-exporter for compatibility with mkdocs-static-i18n and Scribe embeds.

Run after installing mkdocs-exporter:
    python methodology/plugins/patch_exporter.py

Fixes:
1. asyncio event loop mismatch when i18n triggers nested builds
2. Strip iframes before PDF rendering to prevent network timeouts
"""

import inspect
import sys


def patch():
    # Locate installed package files
    import mkdocs_exporter.formats.pdf.plugin as plugin_mod
    import mkdocs_exporter.formats.pdf.renderer as renderer_mod

    plugin_path = inspect.getfile(plugin_mod)
    renderer_path = inspect.getfile(renderer_mod)

    print(f'Plugin file: {plugin_path}')
    print(f'Renderer file: {renderer_path}')

    # Fix 1: Event loop mismatch
    with open(plugin_path, 'r') as f:
        plugin_src = f.read()

    if 'asyncio.set_event_loop(self.loop)' not in plugin_src:
        old = '    while self.tasks:\n'
        if old not in plugin_src:
            print(f'WARNING: Could not find patch target in plugin.py')
            print(f'Looking for: {repr(old)}')
            # Try to find the line with different indentation
            for line in plugin_src.split('\n'):
                if 'while self.tasks' in line:
                    print(f'Found similar line: {repr(line)}')
            sys.exit(1)
        plugin_src = plugin_src.replace(
            old,
            '    asyncio.set_event_loop(self.loop)\n    while self.tasks:\n'
        )
        with open(plugin_path, 'w') as f:
            f.write(plugin_src)
        print(f'OK: Patched event loop fix')
    else:
        print('OK: Event loop fix already applied')

    # Fix 2: Strip iframes before PDF rendering
    with open(renderer_path, 'r') as f:
        renderer_src = f.read()

    if "preprocessor.remove('iframe')" not in renderer_src:
        old = "    preprocessor.preprocess(page.html)\n"
        if old not in renderer_src:
            print(f'WARNING: Could not find patch target in renderer.py')
            print(f'Looking for: {repr(old)}')
            # Try to find the line with different indentation
            for line in renderer_src.split('\n'):
                if 'preprocessor.preprocess' in line:
                    print(f'Found similar line: {repr(line)}')
            sys.exit(1)
        renderer_src = renderer_src.replace(
            old,
            "    preprocessor.preprocess(page.html)\n    preprocessor.remove('iframe')\n"
        )
        with open(renderer_path, 'w') as f:
            f.write(renderer_src)
        print(f'OK: Patched iframe removal')
    else:
        print('OK: Iframe removal already applied')

    # Verify patches
    with open(plugin_path, 'r') as f:
        verify = f.read()
    assert 'asyncio.set_event_loop(self.loop)' in verify, 'Event loop patch verification failed!'

    with open(renderer_path, 'r') as f:
        verify = f.read()
    assert "preprocessor.remove('iframe')" in verify, 'Iframe patch verification failed!'

    print('All patches verified successfully')


if __name__ == '__main__':
    patch()
