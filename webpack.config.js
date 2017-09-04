var path = require('path');
var childProcess = require('child_process');
var webpack = require('webpack');

// Add HMR for development environments only.
var entry = ['./src/index.js'];
if (process.env.NODE_ENV === 'dev') {
  entry = [
    'webpack-dev-server/client?http://localhost:3333',
    'webpack/hot/only-dev-server'
  ].concat(entry);
}

function getBuildTimestamp () {
  function pad2 (value) {
    return ('0' + value).slice(-2);
  }
  var date = new Date();
  var timestamp = [
    pad2(date.getUTCDate()),
    pad2(date.getUTCMonth()+1),
    date.getUTCFullYear()
  ]
  return timestamp.join('-');
}

var commitHash = childProcess.execSync('git rev-parse HEAD').toString();

// Minification.
var plugins = [
  new webpack.DefinePlugin({
    'process.env':{
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    },
    VERSION: JSON.stringify(require('./package.json').version),
    BUILD_TIMESTAMP: JSON.stringify(getBuildTimestamp()),
    COMMIT_HASH: JSON.stringify(commitHash)
  }),
];
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false}
  }));
}

// dist/
var filename = 'aframe-material.js';
var outPath = 'dist';
if (process.env.NODE_ENV === 'production') {
  filename = 'aframe-material.min.js';
}

module.exports = {
  devServer: {port: 3333},
  entry: entry,
  devtool : 'sourcemap',
  output: {
    path: path.join(__dirname, outPath),
    filename: filename,
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          plugins: ['transform-class-properties'],
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: plugins
};
