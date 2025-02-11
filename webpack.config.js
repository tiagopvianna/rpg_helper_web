const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",  // 🔹 Garante que as mudanças são refletidas corretamente
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    allowedHosts: "all",
    host: "0.0.0.0",
    port: 8080,
    hot: true,  // 🔹 Habilita o Hot Module Replacement (HMR)
    liveReload: true,
    watchFiles: ["public/**/*", "src/**/*"],  // 🔹 Monitora mudanças nos arquivos JS
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",  // 🔹 Garante que Webpack reconhece mudanças nos arquivos JS
        },
      },
    ],
  },
};
