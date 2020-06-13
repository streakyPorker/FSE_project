<template>
  <div>
    <v-toolbar elevation="0" id="world_info" class>
      <v-icon large light>fa-angle-double-right</v-icon>

      <v-spacer></v-spacer>
      <v-tabs :value="0" class="ml-12 mr-12" @change="opChange">
        <v-tab class="float-right" :value="0">查看当前管理员</v-tab>
        <v-tab class="float-right" :value="1">省市管理员操作</v-tab>
      </v-tabs>
    </v-toolbar>
    <div v-show="whichOp==0">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-data-table
            :headers="adminHeader"
            :items="provAdmins"
            :single-expand="true"
            :items-per-page="34"
            class="elevation-1 mb-12"
          ></v-data-table>
        </v-flex>
      </v-layout>
    </div>

    <div v-show="whichOp==1">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">选择管理员管理方法</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 2" step="2">选择进一步操作</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3">确认信息</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" height="250px">
                  <v-card-title class="headline">
                    <v-layout row wrap>
                      <v-flex xs2 class="mt-8 mb-3">
                        <v-switch :label="getTips" v-model="v1" class="ma-2"></v-switch>
                      </v-flex>
                      <v-flex xs8 offset-xs1 class="mt-8 mb-3">
                        <v-select
                          outlined
                          :disabled="!v1"
                          v-model="adder"
                          label="请选择添加方法"
                          :items="addOps"
                          prepend-icon="fa-info"
                          autofocus
                        ></v-select>
                      </v-flex>

                      <v-flex xs2></v-flex>
                      <v-flex xs8 offset-xs1>
                        <v-select
                          outlined
                          :disabled="v1"
                          v-model="deler"
                          label="请选择更新的地区"
                          :items="delOps"
                          prepend-icon="fa-info"
                          autofocus
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                </v-card>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="e1 = 2" class="float-right">下一步</v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" height="250px">
                  <div v-show="v1&&adder=='单个添加'">
                    <v-layout row wrap>
                      <v-flex xs5 offset-xs2 class="mt-4">
                        <v-select
                          outlined
                          v-model="chosenProv"
                          label="请选择添加省的管理员"
                          :items="getProvinces"
                          prepend-icon="fa-info"
                          autofocus
                        ></v-select>
                      </v-flex>

                      <v-flex xs5 class="mt-4">
                        <v-chip class="mt-3 ml-12">该省现已有{{getCount}}位管理员</v-chip>
                      </v-flex>
                      <v-flex xs5 offset-xs2>
                        <v-text-field
                          v-model="adminName"
                          :counter="10"
                          :rules="[v => !!v || 'Not empty!']"
                          label="用户名"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs5 class="mt-4">
                        <v-chip class="mt-3 ml-12">若管理员名称已存在则不能继续</v-chip>
                      </v-flex>
                      <v-flex xs5 offset-xs2>
                        <v-text-field
                          v-model="password"
                          :counter="15"
                          :rules="[v => !!v || 'Not empty!']"
                          label="密码"
                          required
                          type="password"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs5 class="mt-4">
                        <v-chip class="mt-3 ml-12">默认密码为123456</v-chip>
                      </v-flex>
                    </v-layout>
                  </div>
                  <div v-show="v1&&adder=='批量添加'">
                    <v-layout row wrap>
                      <v-flex xs5 offset-xs2>
                        <v-text-field
                          v-model="append"
                          :counter="8"
                          :rules="[v => !!v || 'Not empty!']"
                          label="用户名后缀"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs5 class="mt-4">
                        <v-chip class="mt-3 ml-12">管理员名称为：省名称+后缀</v-chip>
                      </v-flex>
                      <v-flex xs5 offset-xs2>
                        <v-text-field
                          v-model="password"
                          :counter="15"
                          :rules="[v => !!v || 'Not empty!']"
                          label="密码"
                          required
                          type="password"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs5 class="mt-4">
                        <v-chip class="mt-3 ml-12">默认密码为123456</v-chip>
                      </v-flex>
                    </v-layout>
                  </div>
                  <div v-show="!v1&&deler=='单个删除'">
                    <v-layout row wrap>
                      <v-flex xs5 offset-xs2>
                        <v-text-field
                          v-model="delName"
                          :counter="10"
                          :rules="[v => !!v || 'Not empty!']"
                          label="输入要删除的用户名"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs5 class="mt-4">
                        <v-chip class="mt-3 ml-12">若用户名不存在，则不能进行</v-chip>
                      </v-flex>
                    </v-layout>
                  </div>
                  <div v-show="!v1&&deler=='批量删除'">
                    <v-layout row wrap>
                      <v-flex xs5 offset-xs2 class="mt-4">
                        <v-chip class="mt-3 ml-12">本操作将删除所有的省市管理员，请谨慎操作</v-chip>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-card>
                <div class="float-right">
                  <v-btn color="primary" @click="()=>{e1 = 3;valid=true;}" :disabled="!valid">下一步</v-btn>
                  <v-btn text @click="()=>{e1 = 1;valid=true}">上一步</v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-12" height="250px">
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
                          <v-chip class="ml-2 mb-3">操作类型：{{v1?adder:deler}}</v-chip>
                          <v-chip class="ml-2 mb-3">
                            操作选项：
                            {{getConfig}}
                          </v-chip>
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
    </div>

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
  </div>
</template>


<script>
import { store } from "../store/index";
import Bmob from "hydrogen-js-sdk";
export default {
  created() {
    this.setAdmins();
  },

  computed: {
    getConfig() {
      if (this.v1) {
        if (this.adder == "单个添加") {
          return (
            "添加城市：" + this.chosenProv + ",添加用户名：" + this.adminName
          );
        } else {
          return "用户名后缀：" + this.append;
        }
      } else {
        if (this.deler == "单个删除") {
          return "删除用户名：" + this.delName;
        } else {
          return "全部删除";
        }
      }
    },
    getTips() {
      return this.v1 ? "添加管理员" : "删除管理员";
    },
    getCount() {
      if (this.chosenProv == "") return 0;
      var count = 0;
      this.provAdmins.forEach(v => {
        if (v.realm == this.chosenProv) count++;
      });
      return count;
    },

    getProvinces() {
      var data = store.getters.getProvinces;
      // data.unshift("全国所有省份");
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
      whichOp: 0,
      isChange: false,
      provAdmins: [],
      adminHeader: [
        { text: "管理员用户名", value: "username" },
        { text: "管理员管辖范围", value: "realm" },
        { text: "管理员创建时间", value: "createdAt" }
      ],

      e1: 1,
      selectedProvince: "全国所有省份",
      selectedCountry: "全球所有国家和地区",
      v1: true,

      time: "00:00",
      alert: false,
      alertText: "",

      adder: "单个添加",
      deler: "单个删除",
      addOps: ["单个添加", "批量添加"],
      delOps: ["单个删除", "批量删除"],

      chosenProv: "湖北",

      adminName: "",
      append: "",
      delName: "",
      password: "123456",

      valid: false
    };
  },

  methods: {
    test() {
      console.log(store);
      console.log(this.provAdmins);
    },
    setAdmins() {
      this.provAdmins = []
      var q = Bmob.Query("g2_user");
      q.equalTo("role", "==", "province_admin");
      q.find().then(res => {
        res.forEach(v => {
          this.provAdmins.push(v);
        });
        console.log(res);
        console.log(this.provAdmins);
      });
    },
    showTips(text) {
      this.alertText = text;
      this.alert = true;
    },

    opChange(v) {
      this.whichOp = v;
      if (this.isChange && v == 0) {
        this.setAdmins();
        this.isChange= false
      }
      console.log(v);
    },

    submit() {
      var q = Bmob.Query("g2_user");
      if (this.v1) {
        if (this.adder == "单个添加") {
          q.set("username", this.adminName);
          q.set("password", this.password);
          q.set("realm", this.chosenProv);
          q.set("role", "province_admin");
          q.save()
            .then(res => {
              console.log(res);
              this.showTips("添加成功");
              this.afterSubmit()
            })
            .catch(err => {
              console.log(err);
              this.showTips("添加失败");
            });
        } else {
          var q_arr = new Array();
          this.getProvinces.forEach(v => {
            var q2 = Bmob.Query("g2_user");
            q2.set("username", v + this.append);
            q2.set("password", this.password);
            q2.set("realm", v);
            q2.set("role", "province_admin");
            q_arr.push(q2);
          });

          Bmob.Query("g2_user")
            .saveAll(q_arr)
            .then(res => {
              console.log(res);
              this.showTips("添加成功");
              this.afterSubmit()
            })
            .catch(err => {
              console.log(err);
              this.showTips("添加失败");
            });
        }
      } else {
        if (this.deler == "单个删除") {
          q.equalTo("role", "==", "province_admin");
          q.equalTo('username','==',this.delName)
          q.find().then(res => {
            console.log(res)
            res
              .destroyAll()
              .then(r2 => {
                console.log(r2);
                this.showTips("删除成功");
                this.afterSubmit()
              })
              .catch(err => {
                console.log(err);
                this.showTips("删除失败");
              });
          });
        } else {
          q.limit(1000);
          q.equalTo("role", "==", "province_admin");
          q.find().then(res => {
            console.log(res)
            res
              .destroyAll()
              .then(r2 => {
                console.log(r2);
                this.showTips("删除成功");
                this.afterSubmit()
              })
              .catch(err => {
                console.log(err);
                this.showTips("删除失败");
              });
          });
        }
      }
      this.isChange = true
    },

    afterSubmit(){
      this.adder="单个添加"
      this.deler='单个删除'
      this.chosenProv='湖北'
      this.adminName= "",
      this.append= "",
      this.delName= "",
      this.password= "123456",
      this.valid= false
      this.v1=true
      this.e1 = 1
    }
  },
  watch: {
    adminName(val) {
      var flag = true;
      this.provAdmins.forEach(v => {
        if (v.username == val) {
          this.valid = false;
          flag = false;
        }
      });
      if (flag) this.valid = true;
    },

    append(val) {
      var flag = true;
      this.provAdmins.forEach(v => {
        if (
          v.username.indexOf(val) != -1 &&
          v.username.length == val.length + 2
        ) {
          this.valid = false;
          flag = false;
        }
      });
      if (flag) this.valid = true;
    },

    delName(val) {
      var flag = true;
      this.provAdmins.forEach(v => {
        if (v.username == val) {
          this.valid = true;
          flag = false;
        }
      });
      if (flag) this.valid = false;
    }
  }
};
</script>