const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { appRoot, outputPath, bundleName } = require('./config');
const WeappWebpackPlugin = require('./plugin');
const { getEntryMap } = require('./utils');

const { NODE_ENV, PORT, IP = require('ip').address() } = process.env;

function getWebpackConfig(entry = []) {

  const entryMap = getEntryMap(entry);

  const entryLoader = {
    loader: path.resolve('scripts/entry-loader.js'),
    options: {
      entryMap,
      entry
    }
  }

  const importLoader = {
    loader: path.resolve('scripts/import-loader.js'),
    options: {
      entryMap,
      entry,
      exts: ['wxml', 'scss', 'wxss', 'json']
    }
  }

  const config = {
    devtool: false,
    entry,
    output: {
      path: outputPath,
      filename: bundleName,
      libraryTarget: 'commonjs2'
    },
    optimization: {
      splitChunks: false
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            { ...entryLoader },
            'ts-loader',
            { ...importLoader}
          ]
        },
        {
          test: /\.js$/,
          use: [
            { ...entryLoader },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            },
            { ...importLoader}
          ]
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  const ext = path.extname(file);
                  const filename = file.replace(appRoot, '').replace(ext, '');
                  return `${filename}.wxss`;
                }
              }
            },
            'extract-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          type: 'javascript/auto',
          test: /\.(json|wxml|wxss)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  const ext = path.extname(file);
                  return file.replace(appRoot, '');
                }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.json', '.scss'],
      alias: {
        'mobx': path.resolve('node_modules/mobx'),
        '@store': path.join(appRoot, 'store'),
        '@utils': path.join(appRoot, 'utils')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
          ip: JSON.stringify(IP),
          port: JSON.stringify(PORT),
        }
      }),
      new WeappWebpackPlugin({
        outputPath,
        entryMap,
        bundleName
      }),
      new CopyWebpackPlugin([{
        from: `${appRoot}/**/*.+(png|jpg|jpeg|gif|wxs)`,
        to: outputPath,
        cache: true,
        context: appRoot
      }], { debug: false })
    ]
  }

  return config;
}

module.exports = getWebpackConfig;
