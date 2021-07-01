const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'node',
  entry: 'src/index.ts',
  mode: 'development',
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    pathinfo: true,
    libraryTarget: 'umd',
    devtoolModuleFilenameTemplate: 'webpack-tabby-clickable-links:///[resource-path]',
  },
  resolve: {
    modules: ['.', 'src', 'node_modules'].map(x => path.join(__dirname, x)),
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: path.resolve(__dirname, 'tsconfig.json'),
        }
      },
      { test: /\.pug$/, use: ['apply-loader', 'pug-loader'] },
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude: [/node_modules/, /vendor/],
      filename: '[file].map',
    }),
  ],
  externals: [
    'fs/promises',
    'path',
    'ngx-toastr',
    /^rxjs/,
    /^@angular/,
    /^@ng-bootstrap/,
    /^tabby-/,
  ]
}
