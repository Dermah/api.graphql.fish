let path = require('path');

module.exports = {
  entry: './src/server.js',
  target: 'node',
  output: {
    libraryTarget:'commonjs',
    path: path.join(__dirname,'.webpack'),
    filename: 'src/server.js',
  },
  module: {
    loaders: [{
     test: /\.js$/,
     loaders: ['babel-loader'],
     include: __dirname,
     exclude: /node_modules/,
   }]
  }
};