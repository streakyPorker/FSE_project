<template>
  <div class="homepage">
    <v-layout row wrap class="stk">
      <v-flex xs12>
        <v-carousel continuous cycle interval="5000">
          <v-carousel-item
            v-for="(item, i) in slides"
            :key="i"
            :src="item.src"
            @click.native="item.func"
          ></v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>

    <div class="upper">
      <div>
        <v-layout
          row
          wrap
          class="elevation-10 ml-5 mr-5 mt-12"
          :style="{ 'border-radius': '10px', height: '150px' }"
        >
          <v-flex xs12>
            <div class="ml-3" height="20px">
              注：境外输入采用所有省/直辖市公布境外输入之和作为全国数据
            </div>
            <v-divider></v-divider>
          </v-flex>

          <v-flex xs2>
            <div class="text-center display-1" :style="{ color: '#D46464' }">
              {{ cnStats.curConfirmed }}
            </div>
            <div class="text-center caption">现存确诊</div>
          </v-flex>

          <v-flex xs2>
            <div class="text-center display-1" :style="{ color: '#f8987b' }">
              {{ cnStats.cumuConfirmed }}
            </div>
            <div class="text-center caption">累计确诊</div>
          </v-flex>

          <v-flex xs2>
            <div class="text-center display-1" :style="{ color: '#efc856' }">
              {{ cnStats.incomeNum }}
            </div>
            <div class="text-center caption">境外输入</div>
          </v-flex>

          <v-flex xs2>
            <div class="text-center display-1" :style="{ color: '#d86422' }">
              {{ ns }}
            </div>
            <div class="text-center caption">现存无症状</div>
          </v-flex>

          <v-flex xs2>
            <div class="text-center display-1" :style="{ color: '#85c5a0' }">
              {{ cnStats.cumuCured }}
            </div>
            <div class="text-center caption">累计治愈</div>
          </v-flex>

          <v-flex xs2>
            <div class="text-center display-1" :style="{ color: '#767676' }">
              {{ cnStats.cumuDead }}
            </div>
            <div class="text-center caption">累计死亡</div>
          </v-flex>
        </v-layout>
      </div>
      <v-bottom-navigation class="overflow-hidden mt-12">
        <v-btn value="favorites" @click="toa">
          <span>疫情管控系统</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
    <!-- <div xs12 class="mt-1" :style="{height:'300px'}"></div> -->
    <div class="text-center mt-5 font-weight-light" color="grey--text">Copyright @2020 G2 FSE</div>
  </div>
</template>

<script>
// @ is an alias to /src
import Bmob from "hydrogen-js-sdk";
import { store } from "@/store";
export default {
  mounted() {
    const q = Bmob.Query("country_stats");
    q.equalTo("name", "==", "中国");
    q.find().then((res) => {
      this.cnStats = res[0];
      let q2 = Bmob.Query("ns");
      q2.find().then((res) => {
        console.log(res);
        let data = res[0];
        this.ns = data.number;
        console.log("load data done");
        sessionStorage
      });
    });
  },

  data() {
    return {
      cnStats: {},
      urla: "localhost:3000",
      urlb: "localhost:8080",
      urlc: "localhost:8080",
      sbmob: Bmob,
      ns: 0,
      slides: [
        {
          src: "http://120.26.184.236:8800/covid19.png",
          func: () => {
            if (!store.getters.hasLogin) {
              store.commit("dereq");
              console.log(store.getters.reqlog);
            }
          },
          discription: "疫情信息登录导航",
        },
        {
          src: "http://120.26.184.236:8800/who!.jpg",
          func: () => {
            window.location.href = "https://www.who.int/";
          },
          discription: "浙大官网友情链接",
        },
      ],
      value: 0,
    };
  },

  methods: {
    toa() {
      console.log("??")
      window.location.href = 'http://120.26.184.236:3000'
    },
    tob() {
      window.location.href =
        this.tob + "?username=" + store.getters.getUserInfo.username;
    },
    toc() {
      window.location.href =
        this.toc + "?username=" + store.getters.getUserInfo.username;
    },
  },
};
</script>

<style scoped>
.disc {
  position: absolute;
  bottom: 50px;
  width: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.5em;
  padding: 15px;
}

.radius {
  border-radius: 20px;
}

.stk {
  position: -webkit-sticky;
  position: sticky;
  top: 80px;
  /* z-index:-1; */
}

.upper {
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  z-index: 5;
  background-color: white;
  width: 100%;
  border-radius: "10px";
}
</style>
