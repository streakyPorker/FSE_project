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
import lib from '@/lib/funcs.js'
import Bmob from 'hydrogen-js-sdk'

export default {
  name: "App",
  components: { Navbar },
  data(){
    return{

    }
  },

  methods:{
    test(){
      // var url = 'http://111.231.75.86:8000/api/provinces/湖北/daily'
      // this.axios.get(url)
      // .then(res => {
      //   console.log(res)
      // })
  console.log(Bmob)
  //     const t = Bmob.Query('province_stats')
  //     t.equalTo('name','==','河南')
  //     t.find().then(res=>{
  //       console.log(res)
  //       console.log(res[0].name,'what')
  //     })

      

      lib.test()
      // lib.multiTimesFuncs.updateContriesStats();
      // lib.multiTimesFuncs.loadStats('country')
      // lib.multiTimesFuncs.loadStats('province')
    
      // var today = this.dateFormat('YYYYMMdd',new Date())
      // console.log(today)
      // lib.multiTimesFuncs.updateCountryOrProvinceDaily('country',today)

      lib.multiTimesFuncs.updateCountryOrProvinceStats('province')
      

      // lib.multiTimesFuncs.loadCountries();
      // lib.multiTimesFuncs.loadProvinces();

      // lib.oneOffFuncs.loadCountries().then((v)=>{
      //   console.log(v)
      //   console.log('done')
      // })


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
          "Y+": date.getFullYear().toString(),        // 年
          "M+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日

          // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          }
      }
      return fmt;
    }


  }
};
</script>
