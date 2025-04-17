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
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'autoprefixer',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {
      "process/browser": require.resolve("process/browser")
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'development',
        REACT_APP_CLERK_PUBLISHABLE_KEY: env.REACT_APP_CLERK_PUBLISHABLE_KEY
      })
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
}; 