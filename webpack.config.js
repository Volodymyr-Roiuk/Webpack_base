const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const isDevelopment = process.env.NODE_ENV === 'development'; // NODE_ENV змінна яка відповідає за режим в якому ми працюєм
const isProductions = !isDevelopment;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProductions) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const filename = (extension) => isDevelopment ? `[name].${extension}` : `[name].[hash].${extension}`;

const cssLoaders = (extraLoaders) => {
    const loaders = [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: true, // true || false Hot module replacment -  Дозволяє міняти сущності без перезавантаження сторінки актуально для локального сервака
                reloadAll: true,
            }
        }, 
        'css-loader'
    ] // Іде з права на ліво, css-loader - дає вебпаку можливість працювати з css файлами а style-loader - поміщає стилі з файлу css в head в файлі index.html

    if (extraLoaders) {
        loaders.push(extraLoaders);
    }

    return loaders;
}

const babelOptions = (extraPresets) => {
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (extraPresets) {
        options.presets.push(extraPresets);
    }

    return options;
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];

    if (isDevelopment) {
        loaders.push('eslint-loader');
    }

    return loaders;
}

const plugins = () => {
    const base = [ 
        new HTMLWebpackPlugin({ // Плагін який генерує index.html з підключиними скріптами
            template: './index.html', // Вказує шаблон на основі якого потрібно згенерувати index.html
            minify: {
                collapseWhitespace: isProductions // Мініфікує index.html якщо він не в режимі production
            }
        }),
        new CleanWebpackPlugin(), // Чистить папку в яку вебпак складає згенеровані файли від застарілих файлів які не використовуються
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }]
        }),
        new MiniCssExtractPlugin({ // Дозволяє вебпаку створювати окремі css файли
            filename: filename('css')
        })
    ];

    if (isProductions) {
        base.push(new BundleAnalyzerPlugin())
    }
 
    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'), // Вказує звідки брати всі файли
    entry: { // Файли які будуть згенеровані вебпаком
        main: ['@babel/polyfill' ,'./index.jsx'],
        analytics: './analytics.ts'
    },
    output: { // Правила як і куди генерувати файли з entry
        filename: filename('js'), // Використано два патерни вебпаку [name] - підставляє в назву ключ з entry, [contenthash] - генерує хеш код на основі контенту щоб назви не повторювались
        path: path.resolve(__dirname, 'dist') // Шлях куди саме потрібно покласти згенеровані файли
    },
    resolve: {
        extensions: ['.js', '.json', '.png'], // Вказує які розширення файлів вебпак має розуміти, це дозваляє нам при імпорті файлу не писати його розширення
        alias: {
            '@models': path.resolve(__dirname, 'src/models')
        } 
    },
    optimization: optimization(), // Якщо в нас багато вихідних файлів і в всіх них ми використовуєм якісь великі бібліотеки наприклад jquery то webpack підгружає цю бібліотеку один раз в один окремий файл а не декілька раз в кожен файл в якому використовується ця бібліотека що набагато пришвидшує завантаження сторінки 
    devServer: { // Дозволяє запустити локальний сервак  бібліотека webpack-dev-server
        port: 3001,
        hot: isDevelopment
    },
    devtool: isDevelopment ? 'source-map' : '', // Дозволяє в девтулзах переглядати ісходні файли які ми писали в тому форматі в якому вони були до того як вебпак їх зібрав
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/, // Коли вебпак зустрічає імпорт файлу якому підходить ця регулярка він використовує лоадери які є в Use
                use: cssLoaders()
            },
            {
                test: /\.less$/, 
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/, // в регулярці [ac] означає що буква або a або с тобто воно буде працювати і для sass і для scss 
                use: cssLoaders('sass-loader') 
            },
            {
                test: /\.(png|jpeg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders() 
                
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions(['@babel/preset-typescript'])
                }
                
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions(['@babel/preset-react'])
                }
                
            }
        ]
    }
};
