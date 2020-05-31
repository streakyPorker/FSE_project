<template>
  <v-app>
    <Navbar />

    <v-content>
      <v-container fluid>
      
        <router-view></router-view>
        <v-btn color="success" @click="test">text</v-btn>
      </v-container>

      <!-- Echart组件 -->
      <Charts />
    </v-content>
  </v-app>
  
</template>

<script>
import Navbar from "@/components/Navbar";
import Charts from "@/components/Charts";

export default {
  name: "App",
  components: { Navbar, Charts },
  data(){
    return{
    }
  },

  created(){
  },

  mounted(){
  },

  beforeDestroy(){
  },

  methods:{
    test(){
      this.axios.get('http://111.231.75.86:8000/api/provinces/上海/daily')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err);
      })
    },
  },
};

</script>
