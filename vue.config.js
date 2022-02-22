const webpack = require("webpack");
const variables = require(`./config/${process.env.DOCKER_ENV}`);
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new webpack.EnvironmentPlugin(variables)],
  },
});
