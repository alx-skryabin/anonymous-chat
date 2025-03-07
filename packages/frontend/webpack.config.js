const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')

// Функция для загрузки правильного .env файла в зависимости от режима
const getEnvConfig = mode => {
  const envFile = mode === 'production' ? '.env.production' : '.env.development'
  return dotenv.config({path: path.resolve(__dirname, envFile)}).parsed || {}
}

// Функция для преобразования envConfig в формат DefinePlugin
const defineEnvVars = envConfig => {
  const envVars = {}
  for (const key in envConfig) {
    envVars[key] = JSON.stringify(envConfig[key])
  }
  return envVars
}

module.exports = (env, argv) => {
  const mode = argv.mode || 'development' // По умолчанию development
  const envConfig = getEnvConfig(mode)

  return {
    entry: './src/app.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css'
      }),
      new CopyWebpackPlugin({
        patterns: [{from: 'public/favicon.ico', to: 'favicon.ico'}]
      }),
      new webpack.DefinePlugin({
        'process.env': defineEnvVars({
          ...envConfig // Все переменные из .env файла
        })
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      port: 3000,
      open: true
    },
    mode
  }
}
