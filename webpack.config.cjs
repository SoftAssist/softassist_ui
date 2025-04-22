const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Determine which .env file to use based on the mode
const getEnvPath = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return '.env.production';
    case 'staging':
      return '.env.staging';
    default:
      return '.env.development';
  }
};

// Load environment variables from the appropriate .env file
const envPath = getEnvPath();
console.log('Loading environment from:', envPath);
const env = dotenv.config({ path: envPath }).parsed || {};

// Debug log to verify the key is being loaded
console.log('Environment:', {
  'NODE_ENV': process.env.NODE_ENV,
  'ENV_PATH': envPath,
  'CLERK_KEY_EXISTS': !!env.REACT_APP_CLERK_PUBLISHABLE_KEY
});

// Create webpack environment variables
const envKeys = {
  'process.env': {
    'REACT_APP_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.REACT_APP_CLERK_PUBLISHABLE_KEY),
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  }
};

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
        REACT_APP_CLERK_PUBLISHABLE_KEY: env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.REACT_APP_CLERK_PUBLISHABLE_KEY
      })
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
}; 