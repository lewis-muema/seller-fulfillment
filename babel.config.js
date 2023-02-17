const plugins = [];

if (process.env.TEST_ENV === "test") {
  plugins.push([
    "babel-plugin-istanbul",
    {
      extension: [".js", ".vue"],
    },
  ]);
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins,
};
