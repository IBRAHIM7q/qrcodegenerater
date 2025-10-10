module.exports = {
  externals: {
    'node:fs': 'commonjs fs',
    'node:path': 'commonjs path',
    'node:url': 'commonjs url',
    'node:buffer': 'commonjs buffer',
    'node:stream': 'commonjs stream',
    'node:util': 'commonjs util',
    'node:os': 'commonjs os',
    'node:crypto': 'commonjs crypto'
  }
};