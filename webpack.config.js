const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    allowedHosts: "all",  // ✅ Allow any external host (fixes "Invalid Host header")
    host: "0.0.0.0",  // ✅ Ensures it listens on all interfaces
    port: 8080,
    hot: true
  }
};
