<template>
  <div class="homepage">
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in slides"
            :key="i"
            :src="item.src"
            @click.native="item.func"
          >
            
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <div class="ml-3 mr-3">
      <v-layout row wrap class="elevation-10" :style="{'border-radius':'10px','height':'130px'}">
        <v-flex xs12>
          <div class="ml-3">{{Date()}}</div>
          <v-divider></v-divider>
        </v-flex>

        <v-flex xs2>
          <div class="text-center display-1" :style="{color:'#D46464'}">{{cnStats.curConfirmed}}</div>
          <div class="text-center caption">现存确诊</div>
        </v-flex>

        <v-flex xs2>
          <div class="text-center display-1" :style="{color:'#f8987b'}">{{cnStats.cumuConfirmed}}</div>
          <div class="text-center caption">累计确诊</div>
        </v-flex>

        <v-flex xs2>
          <div class="text-center display-1" :style="{color:'#efc856'}">{{cnStats.incomeNum}}</div>
          <div class="text-center caption">境外输入</div>
        </v-flex>

        <v-flex xs2>
          <div class="text-center display-1" :style="{color:'#d86422'}">{{cnStats.curSuspected}}</div>
          <div class="text-center caption">现存疑似</div>
        </v-flex>

        <v-flex xs2>
          <div class="text-center display-1" :style="{color:'#85c5a0'}">{{cnStats.cumuCured}}</div>
          <div class="text-center caption">累计治愈</div>
        </v-flex>

        <v-flex xs2>
          <div class="text-center display-1" :style="{color:'#767676'}">{{cnStats.cumuDead}}</div>
          <div class="text-center caption">累计死亡</div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Bmob from "hydrogen-js-sdk";
import {store} from '@/store'
export default {
  mounted() {
    const q = Bmob.Query("country_stats");
    q.equalTo("name", "==", "中国");
    q.find().then(res => {
      this.cnStats = res[0];
      console.log("load data done");
    });
  },

  data() {
    return {
      cnStats: {},
      sbmob: Bmob,
      slides: [
        {
          src:
            "http://120.26.184.236:8800/covid19.png",
          func: () => {
            store.commit('dereq')
            console.log(store.getters.reqlog)
          },
          discription:'疫情信息登录导航'
        },
        {
          src:
            "http://120.26.184.236:8800/who!.jpg",
          func: () => {
            window.location.href = "https://www.who.int/";
          },
          discription: "浙大官网友情链接"
        },

      ],
      value: 0
    };
  }
};
</script>

<style scoped >
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
</style>