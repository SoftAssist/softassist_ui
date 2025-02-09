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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', {
                runtime: 'automatic'
              }],
              '@babel/preset-env'
            ],
            sourceType: 'unambiguous'
          }
        }
      },
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFiles: ['index'],
    fullySpecified: false
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // Path to your template
      filename: 'index.html'
    }),
    new webpack.DefinePlugin(envKeys)
  ],
  // ... rest of your existing config ...
}; 