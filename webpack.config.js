const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env.development file
const env = dotenv.config({ path: '.env.development' }).parsed || {};

// Create webpack environment variables
const envKeys = {
  'process.env': {
    'REACT_APP_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.REACT_APP_CLERK_PUBLISHABLE_KEY),
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  }
};

// Debug log to verify the key is being loaded
console.log('Clerk Key:', env.REACT_APP_CLERK_PUBLISHABLE_KEY);

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "util": require.resolve("util/"),
      "buffer": require.resolve("buffer/"),
      "process": require.resolve("process/browser.js")
    },
    alias: {
      process: "process/browser.js"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node:process/,
      'process/browser.js'
    )
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
    client: {
      overlay: true,
      progress: true,
      reconnect: true,
    },
    static: {
      directory: path.join(__dirname, 'public'),
      watch: {
        ignored: /node_modules/,
        poll: 1000, // Check for changes every second
      },
    },
    devMiddleware: {
      writeToDisk: false,
    },
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        ignored: /node_modules/,
      },
    },
  },
  devtool: 'source-map',
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}; 