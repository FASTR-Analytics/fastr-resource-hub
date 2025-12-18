from setuptools import setup

setup(
    name='mkdocs-strip-slides',
    version='0.1.0',
    description='MkDocs plugin to strip slide content from methodology docs',
    py_modules=['strip_slides'],
    install_requires=['mkdocs>=1.0'],
    entry_points={
        'mkdocs.plugins': [
            'strip-slides = strip_slides:StripSlidesPlugin',
        ]
    },
)
