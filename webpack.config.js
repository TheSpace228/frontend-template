const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const context = path.resolve(__dirname);

module.exports = {
  context,

  entry: {
		all: ['babel-polyfill', 'jquery', './src/js/index.js', './src/scss/app.scss'],
		pug: './src/js/pug.js',
		images: './src/js/image.js',
  },
  
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dev'),
    pathinfo: true,
  },

  resolve: {
		alias: {
			jquery: path.resolve(context, 'node_modules/jquery/src/jquery.js'),
		},
  },
  
  module: {
    rules: [
      // js loader
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: {
					loader: 'babel-loader',
				},
			},
      // scss loader
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        use: [
          {
						loader: 'file-loader',
						options: {
							name: 'css/[name].css',
						},
          },
          {
            loader: 'extract-loader',
            options: {
							publicPath: './',
						},
					},
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      // pug loader
			{
				test: /\.(pug)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].html',
							context: 'src/pug/',
						},
					},
					{
						loader: 'pug-html-loader',
						options: {
							pretty: true,
						},
					},
				],
			},

			// images loader
			{
				test: /\.(jpg|jpeg|png|svg|ico|gif)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							context: 'src/',
						},
					},
					{
						loader: 'image-webpack-loader',
						options: {
							svgo: {
								plugins: [{removeEmptyAttrs: true}],
							},
							optipng: {
								optimizationLevel: 5,
							},
							mozjpeg: {
								quality: 80,
							},
						},
					},
				],
			}
    ]
	},
	
	target: 'web',
	devtool: 'eval',
	stats: {
		colors: true,
		modules: false,
	},
	watch: true,
	watchOptions: {
		poll: 1000,
		ignored: /node_modules/,
	},

	plugins: [
		new CleanPlugin(['dev/'], {
			root: context,
			verbose: true,
			dry: false,
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			server: {
				baseDir: 'dev',
				directory: true,
			},
			startPath: '/index.html',
		}),
	],
};