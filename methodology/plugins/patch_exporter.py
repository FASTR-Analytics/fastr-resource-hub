"""
Patch mkdocs-exporter for compatibility with mkdocs-static-i18n and Scribe embeds.

Run after installing mkdocs-exporter:
    python methodology/plugins/patch_exporter.py

Fixes:
1. asyncio event loop: i18n triggers a nested build() that overwrites the
   exporter's self.loop while EN tasks are still pending. Fix: create a
   fresh event loop in _on_post_build_1 right before running tasks.
2. _on_post_build_3 null safety: after the nested build cleans up,
   the outer build's _on_post_build_3 hits None renderer/loop.
3. Strip iframes before PDF rendering to prevent Playwright networkidle
   timeouts on Scribe embeds.
"""

import inspect
import sys


def patch():
    import mkdocs_exporter.formats.pdf.plugin as plugin_mod
    import mkdocs_exporter.formats.pdf.renderer as renderer_mod

    plugin_path = inspect.getfile(plugin_mod)
    renderer_path = inspect.getfile(renderer_mod)

    print(f'Plugin file: {plugin_path}')
    print(f'Renderer file: {renderer_path}')

    # ── Fix 1: Fresh event loop before running tasks in _on_post_build_1 ──
    with open(plugin_path, 'r') as f:
        plugin_src = f.read()

    # Use a context-specific marker so we don't match on_pre_build's set_event_loop
    MARKER = 'self.loop = asyncio.new_event_loop()  # patch: fresh loop'

    if MARKER not in plugin_src:
        # Target the unique block in _on_post_build_1
        old = (
            '    if not self._enabled():\n'
            '      return\n'
            '    while self.tasks:\n'
        )
        new = (
            '    if not self._enabled():\n'
            '      return\n'
            '    self.loop = asyncio.new_event_loop()  # patch: fresh loop\n'
            '    asyncio.set_event_loop(self.loop)\n'
            '    while self.tasks:\n'
        )
        if old not in plugin_src:
            print('ERROR: Cannot find _on_post_build_1 patch target')
            print(f'Looking for: {repr(old)}')
            for i, line in enumerate(plugin_src.split('\n'), 1):
                if 'while self.tasks' in line or '_on_post_build' in line:
                    print(f'  Line {i}: {repr(line)}')
            sys.exit(1)

        # Only replace the FIRST occurrence (_on_post_build_1, not _on_post_build_2)
        plugin_src = plugin_src.replace(old, new, 1)
        print('OK: Patched _on_post_build_1 with fresh event loop')
    else:
        print('OK: _on_post_build_1 event loop fix already applied')

    # ── Fix 2: Null safety in _on_post_build_3 ──
    MARKER2 = 'if self.renderer and self.loop:  # patch: null safety'

    if MARKER2 not in plugin_src:
        old2 = '    self.loop.run_until_complete(self.renderer.dispose())\n'
        new2 = (
            '    if self.renderer and self.loop:  # patch: null safety\n'
            '      self.loop.run_until_complete(self.renderer.dispose())\n'
        )
        if old2 not in plugin_src:
            print('ERROR: Cannot find _on_post_build_3 dispose target')
            for i, line in enumerate(plugin_src.split('\n'), 1):
                if 'dispose' in line:
                    print(f'  Line {i}: {repr(line)}')
            sys.exit(1)

        plugin_src = plugin_src.replace(old2, new2, 1)
        print('OK: Patched _on_post_build_3 with null safety')
    else:
        print('OK: _on_post_build_3 null safety already applied')

    with open(plugin_path, 'w') as f:
        f.write(plugin_src)

    # ── Fix 3: Strip iframes before PDF rendering ──
    with open(renderer_path, 'r') as f:
        renderer_src = f.read()

    if "preprocessor.remove('iframe')" not in renderer_src:
        old3 = "    preprocessor.preprocess(page.html)\n"
        if old3 not in renderer_src:
            print('ERROR: Cannot find renderer.py iframe patch target')
            for i, line in enumerate(renderer_src.split('\n'), 1):
                if 'preprocessor.preprocess' in line:
                    print(f'  Line {i}: {repr(line)}')
            sys.exit(1)

        renderer_src = renderer_src.replace(
            old3,
            "    preprocessor.preprocess(page.html)\n"
            "    preprocessor.remove('iframe')\n"
        )
        with open(renderer_path, 'w') as f:
            f.write(renderer_src)
        print('OK: Patched iframe removal in renderer')
    else:
        print('OK: Iframe removal already applied')

    # ── Verify all patches ──
    with open(plugin_path, 'r') as f:
        verify = f.read()
    assert MARKER in verify, 'Fresh loop patch verification failed!'
    assert MARKER2 in verify, 'Null safety patch verification failed!'

    with open(renderer_path, 'r') as f:
        verify = f.read()
    assert "preprocessor.remove('iframe')" in verify, 'Iframe patch verification failed!'

    print('All patches verified successfully')


if __name__ == '__main__':
    patch()
