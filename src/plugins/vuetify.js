import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        navbar:"#F4F4F4",
        log_btn:'#5BB9E4',
        primary: '#546E7A',
        success: '#3cd1c2',
        info: '#ffaa2c',
        error: '#f83e70'
      }
    },
    icons:{
      iconfont:'fa'
    }
  }
});
