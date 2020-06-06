// asd
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath:'./',
  devServer: {
    open:true,
    port:8080,
    proxy: {
      '/api':{
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws:false,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/remote': {
        target: 'http://111.231.75.86:8000',
        changeOrigin:true,
        ws:false,
        pathRewrite: {
          '^/remote': ''
        }
      },

      
      // 把链接代理到3000接口


    }
  },

}