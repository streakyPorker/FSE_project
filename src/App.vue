<template>
  <v-app>
    <Navbar class="fx" />

    <v-content>
      <router-view :style="{width:'100%'}"></router-view>
      <v-container fluid>
        <!-- <v-btn color="success" @click="test">text（勿点）</v-btn>
        <v-btn color="success" @click="test2">更新测试（勿点）</v-btn>
        <v-btn color="success" @click="test3">测试用户接口</v-btn> -->
        <!-- <v-btn color="success" @click="test4">测试vuex</v-btn> -->

      </v-container>

      <!-- Echart组件 -->
    </v-content>

  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import lib from "@/lib/funcs.js";
import Bmob from "hydrogen-js-sdk";
import { store } from "./store/index";
export default {
  name: "App",
  components: { Navbar },
  data() {
    return {};
  },

  created() {},

  mounted() {},

  beforeDestroy() {},

  methods: {
    test() {
      console.log(lib, Bmob, store);
    },
    test2() {
      this.axios.get("api/api/pta").then(res => {
        console.log(res);
      });
    },
    test3() {
      

    },
    test4() {
      // console.log(store.getters.getUserInfo.realm)
      this.axios
        this.axios.get('http://111.231.75.86:8000/api/cities/CHN')
        .then(res => {
          console.log(res);
        });
      // lib.multiTimesFuncs.updateCountryOrProvinceDaily('country')

    },

    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "M+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString() // 日

        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    }
  }
};
</script>



<style scoped>
.fx {
  position: "sticky";
  top: 0;
  z-index: 6;
}
</style>
