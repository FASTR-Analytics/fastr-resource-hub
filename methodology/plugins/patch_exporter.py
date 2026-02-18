"""
Patch mkdocs-exporter for compatibility with mkdocs-static-i18n and Scribe embeds.

Run after installing mkdocs-exporter:
    python methodology/plugins/patch_exporter.py

Fixes:
1. asyncio event loop mismatch when i18n triggers nested builds
2. Strip iframes before PDF rendering to prevent network timeouts
"""

import importlib
import inspect
import re
import sys


def patch():
    # Locate installed package files
    import mkdocs_exporter.formats.pdf.plugin as plugin_mod
    import mkdocs_exporter.formats.pdf.renderer as renderer_mod

    plugin_path = inspect.getfile(plugin_mod)
    renderer_path = inspect.getfile(renderer_mod)

    # Fix 1: Event loop mismatch
    with open(plugin_path, 'r') as f:
        plugin_src = f.read()

    if 'asyncio.set_event_loop(self.loop)' not in plugin_src:
        plugin_src = plugin_src.replace(
            '    while self.tasks:\n',
            '    asyncio.set_event_loop(self.loop)\n    while self.tasks:\n'
        )
        with open(plugin_path, 'w') as f:
            f.write(plugin_src)
        print(f'Patched event loop fix in {plugin_path}')
    else:
        print('Event loop fix already applied')

    # Fix 2: Strip iframes before PDF rendering
    with open(renderer_path, 'r') as f:
        renderer_src = f.read()

    if "preprocessor.remove('iframe')" not in renderer_src:
        renderer_src = renderer_src.replace(
            "    preprocessor.preprocess(page.html)\n",
            "    preprocessor.preprocess(page.html)\n    preprocessor.remove('iframe')\n"
        )
        with open(renderer_path, 'w') as f:
            f.write(renderer_src)
        print(f'Patched iframe removal in {renderer_path}')
    else:
        print('Iframe removal already applied')


if __name__ == '__main__':
    patch()
