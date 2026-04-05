// vue.config.js file to be placed in the root of your repository
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/NAK/'
    : '/'
  ,
  pwa: {
    name: "Wedding Invitation",
    themeColor: "#87CEEB",
    msTileColor: "#87CEEB",
    manifestOptions: {
      background_color: "#87CEEB"
    }
  },
  configureWebpack: {
    plugins: [
      new WorkboxPlugin.InjectManifest({
        swSrc: './public/service-worker.js',
        swDest: 'service-worker.js',
      }),
    ],
  },
}