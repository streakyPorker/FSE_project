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

export default {
  name: "App",
  components: { Navbar },
  data(){
    return{

    }
  },

  methods:{
    test(){
      // var url = 'http://111.231.75.86:8000/api/countries/中国/daily'
      // this.axios.get(url)
      // .then(res => {
      //   console.log(res)
      // })

      

      lib.test()
      // lib.multiTimesFuncs.initProvinceDaily();

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
  }
};
</script>
