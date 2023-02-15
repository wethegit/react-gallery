const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { name } = require("./package.json")

const WTC_PACKAGE_NAME = name.substring(1)

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  module: {
    rules: [
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    mode: "pure",
                    auto: true,
                    exportGlobals: true,
                    localIdentName: `${WTC_PACKAGE_NAME}__[local]--[hash:base64:7]`,
                    localIdentContext: path.resolve(__dirname, "src"),
                    localIdentHashSalt: WTC_PACKAGE_NAME,
                  },
                },
              },
              "sass-loader",
            ],
          },
          {
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: ["@babel/plugin-transform-modules-commonjs"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  experiments: {
    outputModule: true,
  },
  externalsType: "module",
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React",
      module: "react",
    },
    React: "React",
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
  output: {
    filename: "main.mjs",
    path: `${__dirname}/dist`,
    library: {
      type: "module",
    },
    chunkFormat: "module",
  },
}
