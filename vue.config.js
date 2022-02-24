const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const variables = require(`./config/${process.env.DOCKER_ENV}`);

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new webpack.EnvironmentPlugin(variables)],
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
