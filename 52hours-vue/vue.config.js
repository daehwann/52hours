module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/52hours-vue/',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,
  configureWebpack: {
    devtool: 'source-map'
  }
}