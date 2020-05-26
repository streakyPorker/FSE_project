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

export default {
  name: "App",
  components: { Navbar },
  data(){
    return{

    }
  },

  methods:{
    test(){
      this.axios.get('http://111.231.75.86:8000/api/provinces/?provinceShortNames=四川')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err); 
      })
    },
  }
};
</script>
