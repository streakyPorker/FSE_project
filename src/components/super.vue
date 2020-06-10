<template>
  <div>
    <v-toolbar elevation="0" id="world_info" class="">
      <v-icon large light>fa-angle-double-right</v-icon>
      <v-toolbar-title class="ml-6">世界疫情地图</v-toolbar-title>

      <v-tabs :value="0"  class="float-right mr-12"  @change="worldSelectedChange">
        <v-tab :value="0">累计确诊</v-tab>
        <v-tab :value="1">现存确诊</v-tab>
      </v-tabs>
    </v-toolbar>
  </div>
</template>


<script>
import { store } from "../store/index";
// import Bmob from "hydrogen-js-sdk";
export default {
  computed: {},

  data() {
    return {};
  },

  methods: {
    test() {
      console.log(store);
    }
  }
};
</script>