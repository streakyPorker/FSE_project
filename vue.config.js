// asd
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath:'./',
  devServer: {
    proxy: {// 把链接代理到3000接口
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws:true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

}