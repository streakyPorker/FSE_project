<template>
  <div>

      <v-layout row wrap >
        <v-flex xs5 class="ml-5 mt-3 mb-5">
          您好，{{getUserInfo.username}}。您的身份是：
          {{getRoleName}}
        </v-flex>
      </v-layout>
      <v-banner >
        <div class="title">请选择操作： </div>
        <template v-slot:actions>
          <v-btn
            color="success--text"
            hover
            v-for="(item, index) in getFilteredDispatchOps"
            :key="index"
            router :to="item.path"
            class="mb-2 mr-3"
          >{{item.text}}</v-btn>

        </template>
      </v-banner>
      <router-view></router-view>
  </div>
</template>

<script>
import { store } from "../store/index";
// import Bmob from "hydrogen-js-sdk";
export default {
  computed: {
    getUserInfo() {
      return store.getters.getUserInfo;
    },
    getRoleGrade() {
      return store.getters.getRoleGrade;
    },
    getRoleName() {
      if(this.getUserInfo.role == "prov_admin") return '省市管理员'
      else if (this.getUserInfo.role == "super_admin") return '全国管理员'
      else return '游客'
    },
    getFilteredDispatchOps() {
      return store.getters.getFilteredDispatchOps;
    }
  },
  watch: {
    getRoleGrade(val, oldVal) {
      if (val < 2 || oldVal < 2) {
        // 身份不再是管理员
        this.$router.push({ path: "/" });
      }
    },

    
  },

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