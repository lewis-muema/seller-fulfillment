const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const variables = require(`./config/${process.env.DOCKER_ENV}`);
const path = require(`path`);

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new webpack.EnvironmentPlugin(variables)],
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve(`./node_modules/vue`),
      },
    },
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
