const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CopyPlugin = require("copy-webpack-plugin");

var publicUrl = '';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: 'production',
  module: {
	rules: [
		{
			test: /\.js|jsx$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-env',
						['@babel/preset-react', {"runtime":"automatic"}]
					],
				}
			}
		},
		{
			test: /\.css$/i,
			use: [MiniCssExtractPlugin.loader, "css-loader"]
		},
		{
			test: /\.svg$/i,
			use: [
				{
					loader: 'svg-url-loader',
					options: {
						limit: 10000,
					},
				},
			]
		}
	]
  },
  plugins: [
	new HtmlWebpackPlugin({
		inject: true,
		template: './public/index.html',
		filename: 'popup.html',
	}),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
		PUBLIC_URL: publicUrl,
	}),
	new MiniCssExtractPlugin(),
	new CopyPlugin({
		patterns: [
			{
				from: 'public',
			}
		]
	})
  ]
};