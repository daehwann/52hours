module.exports = {
  baseUrl: '/',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,
  configureWebpack: {
    devtool: 'source-map'
  },
  pwa: {
    name: '퇴근',
    themeColor: '#F5F5F5',
    
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
        // swSrc is required in InjectManifest mode.
        swSrc: 'public/service-worker.js',
        // ...other Workbox options...
    },
    iconPaths: {
      favicon32: 'img/favicon/favicon-32x32.png',
      favicon16: 'img/favicon/favicon-16x16.png',
      appleTouchIcon: 'img/favicon/apple-touch-icon.png',
      maskIcon: 'img/favicon/safari-pinned-tab.svg',
      msTileImage: 'img/favicon/mstile-150x150.png'
    }
  }
}