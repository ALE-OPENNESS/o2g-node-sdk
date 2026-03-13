const path = require('path');

module.exports = {
  entry: './src/o2g-node-sdk.ts',
  target: 'node', 
  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'o2g-node-sdk.js',
    library: {
      type: 'commonjs2',
    },
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
            loader: 'ts-loader',
            options: {
                configFile: 'tsconfig.build.json'
            }
        }
      },
    ],
  },

  externals: {
    // Do not bundle these (they are required at runtime)
    'node-fetch': 'commonjs node-fetch',
    'fetch-cookie': 'commonjs fetch-cookie',
    'tough-cookie': 'commonjs tough-cookie',
    'reflect-metadata': 'commonjs reflect-metadata',
    'uuid': 'commonjs uuid',
    'inversify': 'commonjs inversify',
  },

  devtool: 'source-map', // Enable source maps for debugging
};
