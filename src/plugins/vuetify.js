import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        navbar:"8e24aa",
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
