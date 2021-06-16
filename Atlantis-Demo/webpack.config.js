const path = require('path');

// module.exports = {
//   mode: 'development',
//   entry: './foo.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'foo.bundle.js',
//   },
// };
// See: Configuration section for all supported configuration options

module.exports = {
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    mode: process.env.NODE_ENV,    
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: {
              loader: 'babel-loader', // 'file-loader'
              options: {
                  presets: ['@babel/preset-env', '@babel/preset-react']
              }
          },
      },
      {
          test: /\.s[ac]ss$/i,
          exclude: /node_modules/,
          use: [
              'style-loader',
              'css-loader',
              'sass-loader'
          ],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    devServer : {
      publicPath: '/build',
      proxy: {
        '/api': 'http://localhost:3000',
        '/': 'http://localhost:3000'

      },
      
      hot: true, 
    },
};
