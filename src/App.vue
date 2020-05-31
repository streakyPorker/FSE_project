<template>
  <v-app>
    <Navbar />

    <v-content>
      <v-container fluid>
        <router-view></router-view>
        <v-btn color="success" @click="test">text</v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import lib from "@/lib/funcs.js";
import Bmob from "hydrogen-js-sdk";

export default {
  name: "App",
  components: { Navbar },
  data() {
    return {};
  },

  methods: {
    test() {
      console.log(lib, Bmob);

      // var url = 'http://111.231.75.86:8000/api/countries'
      // this.axios.get('http://111.231.75.86:8000/api/provinces/河南/daily')
      // .then(v=>{
      //   var data = v.data.slice(100)
      //   console.log(data)
      // })
      // console.log([1,2,3,4,5,6,7].slice(-1))
      // const t = Bmob.Query("rrr2");
      // t.limit(50);

      //   t.find().then(res => {
      //     res.destroyAll().then(() => {
      //       t.find().then(res => {
      //         res.destroyAll().then(() => {
      //           t.find().then(res => {
      //             res.destroyAll().then(() => {
      //               t.find().then(res => {
      //                 res.destroyAll().then(() => {
      //                   console.log("done");
      //   })})})})})})})});
      

      // lib.multiTimesFuncs.updateContriesStats();
      // lib.multiTimesFuncs.loadStats('country')
      // lib.multiTimesFuncs.loadStats('province')

      // var today = this.dateFormat('YYYYMMdd',new Date())
      // console.log(today)
      // lib.multiTimesFuncs.updateCountryOrProvinceDaily('province',today)

      // lib.multiTimesFuncs.updateCountryOrProvinceDaily('country')
      lib.multiTimesFuncs.initCountryDaily()


      // lib.multiTimesFuncs.loadCountries();
      // lib.multiTimesFuncs.loadProvinces();


      /*
      export  default{
          test:test,
          oneOffFuncs:oneOffFuncs,
          multiTimesFuncs:multiTimesFuncs,
      }
*/

      // alert('done')
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
