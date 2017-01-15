
# Always prefer setuptools over distutils
try:
    from setuptools import setup, find_packages
except ImportError:
    from distutils.core import setup
    
from os import path

here = path.abspath(path.dirname(__file__))

setup(
    name='projectname',
    version='0.0.1',
    description='My Project',
    url='URL to get it at',
    author='Matt Whiteway',
    author_email='themattinthehatt@gmail.com',
    
    # just specify packages manually here if project is simple, or use find_packages
    packages=find_packages(exclude=['docs','tests']),
    
    # run-time dependencies. These will be installed by pip when project is installed
    install_requires=['nose'],
    
    # If there are data files included in your packages that need to be
    # installed, specify them here.  If using Python 2.6 or less, then these
    # have to be included in MANIFEST.in as well.
    package_data={
        'sample': ['package_data.dat'],
    },

    # Although 'package_data' is the preferred approach, in some case you may
    # need to place data files outside of your packages. See:
    # http://docs.python.org/3.4/distutils/setupscript.html#installing-additional-files # noqa
    # In this case, 'data_file' will be installed into '<sys.prefix>/my_data'
    data_files=[('my_data', ['data/data_file'])],
    
    scripts=[],
    
    # To provide executable scripts, use entry points in preference to the "scripts"
    # keyword. Entry points provide cross-platform support and allow pip to create
    # the appropriate form of executable for the target platform
    entry_points=[]
)
