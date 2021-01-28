const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

const webpackConfig = {
  entry: './app/index.ts',
  mode: 'development',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  context: __dirname,
  devtool: 'source-map',
  externals: [nodeExternals()],
  watch: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              allowTsInNodeModules: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: []
};

const isDev = process.argv.includes('--dev');

if (isDev) {
  webpackConfig.watch = true;
  webpackConfig.mode = 'development';
  webpackConfig.output.path = webpackConfig.output.path.replace('dist', 'dist-dev')
  // webpackConfig.plugins.push(new NodemonPlugin({
  //   args: ['--dev'],
  //   watch: path.resolve('./dist-dev'),
  //   verbose: true,
  //   script: './dist-dev/index.js',
  // }))
  // webpackConfig.output.path.replace('dist')
}

console.log(webpackConfig);

module.exports = webpackConfig;