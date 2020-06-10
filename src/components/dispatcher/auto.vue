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
                      <v-switch label="更新下辖某个地区疫情数据2" v-model="v2" class="ma-2"></v-switch>
                    </v-flex>
                    <v-flex xs8 offset-xs1>
                      <v-text-field label="请输入您想要更新的地区名称" single-line outlined v-model="city"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!(v1||v2)" @click="e1 = 2" class="float-right">下一步</v-btn>
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
                        <v-chip v-if="v2" class="ml-2 mb-3">更新本省下辖地级市为：{{city}}</v-chip>
                        <v-chip class="ml-2 mb-3">更新时间：{{time}}</v-chip>
                      </div>
                    </v-alert>
                  </v-flex>
                </v-layout>
              </v-card>
              <div class="float-right">
                <v-btn color="primary" @click="showTips('test')">提交</v-btn>
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
// import Bmob from 'hydrogen-js-sdk';
// import lib from "@/lib/funcs.js";
export default {
  created(){
    var realm  = store.getters.getUserInfo.realm
    if(realm == 'None'){
      console.log('none')
    }

    

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
    }
  },
  data() {
    return {
      e1: 1,
      selectedProvince: "全国所有省份",
      selectedCountry: "全球所有国家和地区",
      v1: true,
      v2: true,
      time: "00:00",
      alert: false,
      alertText: "",

      cityList:[],
    };
  },

  watch: {}
};
</script>