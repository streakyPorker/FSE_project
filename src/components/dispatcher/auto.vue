<template>
  <v-container fluid>
    <v-dialog
      v-model="alert"
      persistent
      :overlay="false"
      max-width="300px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>提示</v-card-title>
        <v-card-text>{{alertText}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="alert=false" class="mr-4">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">请选择并输入您想要更新的区域</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">选择更新时间戳</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">确认信息</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="mb-12" height="300px">
                <v-card-title class="headline">
                  <v-layout row wrap>
                    <v-flex xs2 class="mt-8 mb-3">
                      <v-switch label="更新全省总体疫情数据" v-model="v1" class="ma-2"></v-switch>
                    </v-flex>
                    <v-flex xs8 offset-xs1 class="mt-8 mb-3"></v-flex>
                    <v-flex xs2>
                      <v-switch label="更新下辖某个地区疫情数据" v-model="v2" class="ma-2"></v-switch>
                    </v-flex>
                    <v-flex xs8 offset-xs1>
                      <v-select
                        outlined
                        v-model="selectedCity"
                        label="请选择更新的地区"
                        :items="cities"
                        prepend-icon="fa-info"
                        autofocus
                        :disabled="v1"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="selectedCity.length==0&&v2" @click="e1 = 2" class="float-right">下一步</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card class="mb-12" height="450px">
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-time-picker headed color="primary" v-model="time"></v-time-picker>
                  </v-flex>
                  <v-flex xs5 offset-xs1>
                    <v-alert
                      border="left"
                      colored-border
                      color="primary"
                      elevation="2"
                      hover
                      class="mb-12 mt-8"
                    >您所选取时间：{{time}}</v-alert>
                    <v-chip class="mb-4">Tips: 本省份不同地区的数据更新不一致</v-chip>
                    <v-chip class="mb-4">Tips: 选择晚些时间会获得更多新数据</v-chip>
                    <v-chip class="mb-4">Tips: 限于服务器带宽，请勿反复进行数据更新</v-chip>
                    <v-chip class="mb-4">Tips: 服务器端会保证该省感染总人数等于各地区感染人数之和</v-chip>
                  </v-flex>
                </v-layout>
              </v-card>
              <div class="float-right">
                <v-btn color="primary" @click="e1 = 3">下一步</v-btn>
                <v-btn text @click="e1 = 1">上一步</v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-card class="mb-12" height="20 0px">
                <v-layout row wrap>
                  <v-flex xs6 offset-xs3>
                    <v-alert
                      border="left"
                      colored-border
                      color="primary"
                      elevation="2"
                      hover
                      class="mb-12 mt-8"
                    >
                      <div>您的选择：</div>
                      <div>
                        <v-chip v-if="v1" class="ml-2 mb-3">更新本省今日疫情数据</v-chip>
                        <v-chip v-if="v2" class="ml-2 mb-3">更新本省下辖地级市为：{{selectedCity}}</v-chip>
                        <v-chip class="ml-2 mb-3">更新时间：{{time}}</v-chip>
                      </div>
                    </v-alert>
                  </v-flex>
                </v-layout>
              </v-card>
              <div class="float-right">
                <v-btn color="primary" @click="submit">提交</v-btn>
                <v-btn text @click="e1=2">返回</v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { store } from "@/store/index";
import Bmob from "hydrogen-js-sdk";
// import lib from "@/lib/funcs.js";
export default {
  mounted() {
    this.loadCities();
  },

  computed: {
    getHeadAndProvinces() {
      var data = store.getters.getProvinces;
      data.unshift("全国所有省份");
      return data;
    },
    getHeadAndCountries() {
      var data = store.getters.getCountries;
      data.unshift("全球所有国家和地区");
      return data;
    },
    getUserInfo() {
      return store.getters.getUserInfo;
    }
  },
  data() {
    return {
      e1: 1,
      selectedCity: "",
      cities: [],
      v1: true,
      v2: false,
      time: "00:00",
      alert: false,
      alertText: "",
      valid:true,

      cityList: []
    };
  },

  methods: {
    init(){
      this.e1=1;
      this.selectedCity='';
      this.time='00:00';
      this.v1=true;
    },
    loadCities() {
      this.cities = [];
      var q = Bmob.Query("cities_stats");
      q.equalTo("provinceName", "==", this.getUserInfo.realm);
      q.find().then(res => {
        res.forEach(v => {
          this.cities.push(v.name);
        });
      });
    },

    showTips(text) {
      this.alertText = text;
      this.alert = true;
    },

    submit() {
      console.log(this.getUserInfo.realm)
      this.axios
        .get(
          "http://111.231.75.86:8000/api/cities/CHN/?provinceNames=" +
            this.getUserInfo.realm
        )
        .then(res => {
          var data = res.data;

          if (this.v1) {
            data.forEach(v => {
              var q = Bmob.Query("cities_stats")
              q.equalTo("name", "==", v.cityName);
              q.equalTo("provinceName", "==", this.getUserInfo.realm);
              q.find().then(res2 => {
                res2.set("curConfirmed", v.currentConfirmedCount);
                res2.set("cumuConfirmed", v.confirmedCount);
                res2.set("cumuCured", v.curedCount);
                res2.set("cumuDead", v.deadCount);
                res2.set("curSuspected", v.suspectedCount);
                res2.saveAll().then(r3 => {
                  console.log(r3);
                  this.showTips("更新成功！");
                });
              });
            });
          } else {
            data.forEach(v => {
              if (v.cityName == this.selectedCity) {
                var q = Bmob.Query("cities_stats")
                q.equalTo("name", "==", v.cityName);
                q.equalTo("provinceName", "==", this.getUserInfo.realm);
                q.find().then(res2 => {
                  res2.set("curConfirmed", v.currentConfirmedCount);
                  res2.set("cumuConfirmed", v.confirmedCount);
                  res2.set("cumuCured", v.curedCount);
                  res2.set("cumuDead", v.deadCount);
                  res2.set("curSuspected", v.suspectedCount);
                  res2.saveAll().then(r3 => {
                    console.log(r3);
                    this.showTips("更新成功！");
                  });
                });
              }
            });
          }
        });
        this.init();


    }
  },

  watch: {
    getUserInfo: {
      deep: true,
      handler: v => {
        if (v.role != "prov_admin") {
          console.log("back");
          this.$router.push({ path: "../" });
        }
      }
    },
    v1(v) {
      this.v2 = !v;
      if(v) this.valid =true;
    },
    v2(v) {
      this.v1 = !v;


    },

    

    
  }
};
</script>