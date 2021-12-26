var webpack = require("webpack");
const path = require('path');


module.exports = {
  // entry: './www/app/_.ts',
  // module: {
  //   rules: [
  //     {
  //       test: /\.tsx?$/,
  //       use: 'ts-loader',
  //       exclude: /node_modules/,
  //     },
  //   ],
  // },
  // resolve: {
  //   extensions: ['.tsx', '.ts', '.js'],
  // },
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(__dirname, 'www'),
  // },
  entry: './src/app/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            projectReferences: true
          }
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // entry: './www/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './www/'),
  },
  optimization: {
    minimize: false
  },
  // resolve: {
  //   extensions: ['', '.js'],
  //   alias: {
  //     'utils': path.resolve(__dirname, './utils')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
  //   }
  // },
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     firebaseApp: 'firebase/app'
  //   }),
  //   new webpack.ProvidePlugin({
  //     'utils': 'utils'
  //   })
  // ]
};