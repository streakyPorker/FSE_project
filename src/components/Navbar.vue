<template>
  <nav>
    <v-app-bar flat app class="sd_br" color="#F4F4F4">
      <v-app-bar-nav-icon
        class
        elevation-10
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class>
        <span class="mr-3 wider">疫情监控系统</span>
        <span>Coronavirus Disease (COVID-19) DashBoard</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        color="log_btn white--text"
        @click="dialog = true"
        v-show="!hasLogin"
        class="mr-3"
      >
        <v-icon class="mr-2">fa-user-circle</v-icon>用户注册/登录
      </v-btn>
      <v-btn
        color="log_btn  white--text"
        @click="dialog2 = true"
        v-show="!hasLogin"
        class="mr-3"
      >
        <v-icon class="mr-2">fa-user-circle</v-icon>管理员登录
      </v-btn>
      <v-btn @click="logout" v-show="hasLogin" class="mr-3">
        <v-icon class="mr-2">fa-user-circle</v-icon>登出
      </v-btn>

      <v-dialog v-model="dialog" persistent max-width="490">
        <v-card>
          <v-card-title class="headline">
            <v-select
              outlined
              v-model="selectedOp"
              label="只有注册/登录后才可以查看疫情地图"
              :items="opList"
              prepend-icon="fa-info"
              autofocus
            ></v-select>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="username"
                :counter="10"
                :rules="[(v) => !!v || 'Not empty!']"
                label="用户名"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :counter="15"
                :rules="[(v) => !!v || 'Not empty!']"
                label="密码"
                required
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="clean1" class="mr-4">取消</v-btn>
            <v-btn
              color="success"
              :disabled="!valid"
              @click="validate1"
              class="mr-4"
              >确认</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog2" persistent max-width="490">
        <v-card>
          <v-card-title class="headline">
            <v-select
              outlined
              v-model="selectedOp2"
              label="请选择管理员类型"
              :items="opList2"
              prepend-icon="fa-info"
              autofocus
            ></v-select>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid2">
              <v-text-field
                v-model="username2"
                :counter="10"
                :rules="[(v) => !!v || 'Not empty!']"
                label="用户名"
                required
              ></v-text-field>
              <v-text-field
                v-model="password2"
                :counter="15"
                :rules="[(v) => !!v || 'Not empty!']"
                label="密码"
                required
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="clean2" class="mr-4">取消</v-btn>
            <v-btn
              color="success"
              :disabled="!valid2"
              @click="validate2"
              class="mr-4"
              >确认</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" class="primary">
      <v-list shaped class="primary">
        <v-list-item
          v-for="link in getFilteredLinks"
          :key="link.text"
          router
          :to="link.route"
        >
          <!--依然需要引号-->
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-dialog
      v-model="alert"
      persistent
      :overlay="false"
      max-width="300px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>提示</v-card-title>
        <v-card-text>{{ alertText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="alert = false" class="mr-4"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </nav>
</template>

<script>
import { store } from "../store/index";
import Bmob from "hydrogen-js-sdk";
export default {
  mounted() {},

  computed: {
    getFilteredLinks() {
      return store.getters.getFilteredLinks;
    },
    hasLogin() {
      return store.getters.hasLogin;
    },
    reqlog() {
      return store.getters.reqlog;
    },
  },

  data() {
    return {
      drawer: true,

      selectedOp: "注册",
      opList: ["注册", "登录"],
      valid: false,
      dialog: false,
      username: "",
      password: "",

      selectedOp2: "省市管理员",
      opList2: ["省市管理员", "超级管理员"],
      valid2: false,
      dialog2: false,
      username2: "",
      password2: "",

      alert: false,
      alertText: "",
    };
  },

  methods: {

    clean1() {
      this.valid = false;
      this.dialog = false;
      this.username = "";
      this.password = "";
    },
    clean2() {
      this.valid2 = false;
      this.dialog2 = false;
      this.username2 = "";
      this.password2 = "";
    },
    validate1() {
      var g2_user = Bmob.Query("g2_user");
      if (this.selectedOp == "注册") {
        g2_user.set("username", this.username);
        g2_user.set("password", this.password);
        g2_user.set("role", "visitor");
        g2_user.set("realm", "None");
        g2_user
          .save()
          .then((res) => {
            console.log(res);
            store.commit("login", {
              username: this.username,
              role: "visitor",
              realm: "None",
            });
            this.clean1();
            this.showTips("注册成功，已自动登录");
          })
          .catch((err) => {
            console.log(err);
            this.showTips("用户名已存在");
          });
      } else {
        g2_user.equalTo("username", "==", this.username);
        g2_user.equalTo("password", "==", this.password);
        g2_user.find().then((res) => {
          if (res.length == 0) {
            this.showTips("用户名或密码错误");
          } else {
            store.commit("login", {
              username: this.username,
              role: "visitor",
              realm: "None",
            });
            this.clean1();
            this.showTips("登录成功");
          }
        });
      }
    },
    validate2() {
      if (this.selectedOp2 == "超级管理员") {
        this.axios
          .get("api/api/" + this.username2)
          .then((res) => {
            if (res.data.length == 0) this.showTips("用户名不存在");
            else {
              var data = res.data[0]; // 主键查询只有一条元组
              if (data.password != this.password2) {
                this.showTips("密码错误");
              } else {
                this.showTips("登陆成功");
                store.commit("login", {
                  username: this.username2,
                  role: "super_admin",
                  realm: "All",
                });
              }
            }
            this.clean2();
          })
          .catch((err) => {
            console.log("oops," + err);
            let t = Bmob.Query("g2_user");
            t.equalTo("username", "==", this.username2);
            t.find().then((res2) => {
              if (res2.length == 0) this.showTips("用户名不存在");
              let data = res2[0];
              if (data.password != this.password2) {
                this.showTips("密码错误");
              } else {
                this.showTips("登陆成功");
                store.commit("login", {
                  username: this.username2,
                  role: "super_admin",
                  realm: "All",
                });
              }
              this.clean2();
            });
          });
      } else {
        // console.log()
        var g2_user = Bmob.Query("g2_user");
        g2_user.equalTo("username", "==", this.username2);
        g2_user.equalTo('role','==',"province_admin")
        g2_user.find().then((res) => {
          if (res.length == 0) this.showTips("用户名不存在");
          else {
            var data = res[0];
            if (data.password != this.password2) this.showTips("密码错误");
            else {
              store.commit("login", {
                username: this.username2,
                role: "prov_admin",
                realm: data.realm,
              });

              this.showTips("登陆成功");
            }
          }
          this.clean2();
        });
      }
    },
    logout() {
      store.commit("logout");
    },

    showTips(text) {
      this.alertText = text;
      this.alert = true;
    },
  },

  watch: {
    reqlog: {
      handler(v) {
        if (v) {
          this.dialog = true;
          store.commit("dereq");
        }
      },
    },

    username(v){
      if(v.length>10){
        this.valid = false
      }
      else this.valid = true

    },
    username2(v){
      if(v.length>10){
        this.valid2 = false
        
      }
      else this.valid2 = true

    },
    password(v){
      if(v.length>15){
        this.valid = false
        
      }
      else this.valid = true

    },
    password2(v){
      if(v.length>15){
        this.valid2 = false
      }
      else this.valid2 = true

    },

  },
};
</script>

<style scoped>
.sd_br {
  border-radius: 20px;
}

.wider {
  letter-spacing: 3px;
}
</style>
