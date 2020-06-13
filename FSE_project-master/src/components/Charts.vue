<template>
  <div>
    <div>
      <v-toolbar elevation="0" id="cn_info">
        <v-icon large light>fa-angle-double-right</v-icon>
        <v-toolbar-title class="ml-6">中国疫情地图</v-toolbar-title>
      </v-toolbar>
    </div>

    <v-layout row wrap>
      <v-flex xs5 class="ml-6">
        <v-btn-toggle mandatory>
          <v-tabs :value="0" @change="mapselectChange">
            <v-tab :value="0">累计确诊</v-tab>
            <v-tab :value="1">现存确诊</v-tab>
            <v-tab :value="2">境外输入</v-tab>
          </v-tabs>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3 offset-xs3>
        <v-btn class="ml-4 float-right" @click="setCN">中国疫情</v-btn>
        <v-btn class="ml-4 float-right" @click="unsetCN">世界疫情</v-btn>
      </v-flex>
    </v-layout>

    <div class="mx-auto">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <div id="mapchart" :style="{width: '100%', height: '500px',margin:'auto'}"></div>
        </v-flex>
      </v-layout>
    </div>
    <v-divider class="mt-4"></v-divider>
    <v-toolbar elevation="0">
      <v-tabs :value="0" @change="lineselectChange" class="float-left">
        <v-tab :value="0">现存确诊</v-tab>
        <v-tab :value="1">累计确诊</v-tab>
        <v-tab :value="2">每日新增</v-tab>
        <v-tab :value="3">累计治愈</v-tab>
        <v-tab :value="4">累计死亡</v-tab>
        <v-tab :value="5">治愈率/死亡率</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>

      <div class="title text-no-wrap mr-6">中国疫情趋势图</div>
      <v-icon large light>fa-angle-double-left</v-icon>
    </v-toolbar>

    <div id="linegraph" :style="{width: '80%', height: '500px',margin:'auto'}"></div>
    <!-- <v-btn-toggle mandatory :value="0" @change="lineselectChange">
      <v-btn :value="0">现存确诊</v-btn>

      <v-btn :value="1">累计确诊</v-btn>

      <v-btn :value="2">每日新增</v-btn>

      <v-btn :value="3">累计治愈</v-btn>

      <v-btn :value="4">累计死亡</v-btn>

      <v-btn :value="5">治愈率/死亡率</v-btn>
    </v-btn-toggle>-->
    <v-divider class="mt-4"></v-divider>
    <v-toolbar elevation="0">
      <v-icon large light>fa-angle-double-right</v-icon>
      <v-toolbar-title class="ml-6">中国各省市统计数据</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :headers="tabheader"
      :items="provinces"
      :single-expand="true"
      :options="taboption"
      :items-per-page="35"
      item-key="name"
      show-expand
      class="elevation-1 mb-12"
    >
      <template v-slot:expanded-item="{ headers,item }">
        <td :colspan="headers.length">
          <v-data-table
            :headers="cityHeader"
            :items-per-page="30"
            :items="getFilteredCities(item.name) 
          "
          ></v-data-table>
        </td>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <v-toolbar elevation="0" id="world_info" class="mt-12">
      <v-icon large light>fa-angle-double-right</v-icon>
      <v-toolbar-title class="ml-6">世界疫情地图</v-toolbar-title>
    </v-toolbar>
    <v-layout row wrap>
      <v-flex xs5 class="ml-6">
        <v-btn-toggle mandatory>
          <v-tabs :value="0" @change="worldSelectedChange">
            <v-tab :value="0">累计确诊病例</v-tab>
            <v-tab :value="1">综合数据散点图</v-tab>
          </v-tabs>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3 offset-xs3>
        
        <v-btn class="ml-4 float-right" @click="setCN">中国疫情</v-btn>
        <v-btn class="ml-4 float-right" @click="unsetCN">世界疫情</v-btn>
      </v-flex>

      <v-flex xs12></v-flex>
    </v-layout>

    <div>
      <div
        v-show="whichWorldMap==0"
        id="worldmap"
        :style="{width: '1300px', height: '600px',margin:'auto'}"
      ></div>
    </div>
    <!-- bubbleMap移到这里 -->

    <div
      v-show="whichWorldMap==1"
      id="bubbleMap"
      :style="{width: '1300px', height: '600px' ,margin:'auto'}"
    ></div>
    <div height="50px"></div>
    <v-toolbar elevation="0">
      <v-tabs :value="0" class="float-left" @change="worldTableChange">
        <v-tab :value="0">世界国家疫情状况</v-tab>
        <v-tab :value="1">美国各州疫情状况</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
<v-divider></v-divider>
      <div class="title text-no-wrap mr-6">世界疫情数据表</div>
      <v-icon large light>fa-angle-double-left</v-icon>
    </v-toolbar>

    <v-carousel v-model="whichWorldTable" :show-arrows="false" hide-delimiters height="1800px">
      <v-carousel-item>
        <v-data-table :headers="worldHeader" :items="countryData" light :items-per-page="30"></v-data-table>
      </v-carousel-item>
      <v-carousel-item>
        <v-data-table :headers="USAHeader" :items="USAProvinceData" light :items-per-page="30"></v-data-table>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import Bmob from "hydrogen-js-sdk";
import { store } from "@/store/index.js";

export default {
  computed: {
    getProvinceList() {
      return store.getters.getProvinces;
    },
    getFilteredCities() {
      return province => {
        return this.filteredCities[this.getProvinceList.indexOf(province)];
      };
    }
  },

  data() {
    return {
      selectedCN: true,
      whichWorldMap: 0,
      whichWorldTable: 0,

      mapOption: {
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            // console.log(params);
            var res = "";
            res = params.data.name + "<br/>";
            res += "累计确诊: " + params.data.cumuConfirmed + "<br/>";
            res += "现存确诊: " + params.data.curConfirmed + "<br/>";
            res += "累计治愈: " + params.data.cured + "<br/>";
            res += "累计死亡: " + params.data.dead;
            return res;
          }
        },
        visualMap: {
          type: "piecewise",
          // dimension: 1,
          pieces: [
            { min: 5000, label: "5000以上", color: "#2B81B7" },
            { min: 1000, max: 4999, label: "1000~4999", color: "#50A9E0" },
            { min: 500, max: 999, label: "500-999", color: "#91C5E5" },
            { min: 100, max: 499, label: "100-499", color: "#A4CCE5" },
            { min: 10, max: 99, label: "10-99", color: "#B9D7EA" },
            { min: 1, max: 9, label: "1-9", color: "#D6E6F2" },
            { max: 0, label: "0", color: "#E2F2FA" }
          ],
          color: ["#E0022B", "#E09107", "#A3E00B"]
        },
        series: {
          name: "累计确诊",
          type: "map",
          map: "china",
          roam: false,

          label: {
            show: true,
            color: "#1C1C1C"
          },
          data: []
        }
      },

      worldmapOption: {
        tooltip: {
          trigger: "item"
        },
        visualMap: {
          type: "piecewise",
          pieces: [
            { min: 5000, label: "5000以上", color: "#2B81B7" },
            { min: 1000, max: 4999, label: "1000~4999", color: "#50A9E0" },
            { min: 500, max: 999, label: "500-999", color: "#91C5E5" },
            { min: 100, max: 499, label: "100-499", color: "#A4CCE5" },
            { min: 10, max: 99, label: "10-99", color: "#B9D7EA" },
            { min: 1, max: 9, label: "1-9", color: "#D6E6F2" },
            { max: 0, label: "0", color: "#E2F2FA" }
          ],
          color: ["#E0022B", "#E09107", "#A3E00B"]
        },
        series: {
          name: "现存确诊",
          type: "map",
          map: "world",
          roam: false,
          label: {
            show: false
          },

          // 自定义地区名的映射，从网站粘贴修正
          nameMap: {
            Afghanistan: "阿富汗",
            Angola: "安哥拉",
            Albania: "阿尔巴尼亚",
            Algeria: "阿尔及利亚",
            Argentina: "阿根廷",
            Armenia: "亚美尼亚",
            Australia: "澳大利亚",
            Austria: "奥地利",
            Azerbaijan: "阿塞拜疆",
            Bahamas: "巴哈马",
            Bangladesh: "孟加拉国",
            Belgium: "比利时",
            Benin: "贝宁",
            "Burkina Faso": "布基纳法索",
            Burundi: "布隆迪",
            Bulgaria: "保加利亚",
            "Bosnia and Herz.": "波斯尼亚和黑塞哥维那",
            Belarus: "白俄罗斯",
            Belize: "伯利兹",
            Bermuda: "百慕大群岛",
            Bolivia: "玻利维亚",
            Brazil: "巴西",
            Brunei: "文莱",
            Bhutan: "不丹",
            Botswana: "博茨瓦纳",
            Cambodia: "柬埔寨",
            Cameroon: "喀麦隆",
            Canada: "加拿大",
            "Central African Rep.": "中非共和国",
            Chad: "乍得",
            Chile: "智利",
            China: "中国",
            Colombia: "哥伦比亚",
            Congo: "刚果（布）",
            "Costa Rica": "哥斯达黎加",
            "Côte d'Ivoire": "科特迪瓦",
            Croatia: "克罗地亚",
            Cuba: "古巴",
            Cyprus: "塞浦路斯",
            "Czech Rep.": "捷克",
            "Dem. Rep. Korea": "韩国",
            "Dem. Rep. Congo": "刚果（金）",
            Denmark: "丹麦",
            Djibouti: "吉布提",
            "Dominican Rep.": "多米尼加",
            Ecuador: "厄瓜多尔",
            Egypt: "埃及",
            "El Salvador": "萨尔瓦多",
            "Eq. Guinea": "赤道几内亚",
            Eritrea: "厄立特里亚",
            Estonia: "爱沙尼亚",
            Ethiopia: "埃塞俄比亚",
            "Falkland Is.": "福克兰群岛",
            Fiji: "斐济",
            Finland: "芬兰",
            France: "法国",
            "French Guiana": "法属圭亚那",
            "Fr. S. Antarctic Lands": "法属南部领地",
            Gabon: "加蓬",
            Gambia: "冈比亚",
            Germany: "德国",
            Georgia: "佐治亚州",
            Ghana: "加纳",
            Greece: "希腊",
            Greenland: "格陵兰",
            Guatemala: "危地马拉",
            Guinea: "几内亚",
            "Guinea-Bissau": "几内亚比绍",
            Guyana: "圭亚那",
            Haiti: "海地",
            "Heard I. and McDonald Is.": "赫德岛和麦克唐纳群岛",
            Honduras: "洪都拉斯",
            Hungary: "匈牙利",
            Iceland: "冰岛",
            India: "印度",
            Indonesia: "印度尼西亚",
            Iran: "伊朗",
            Iraq: "伊拉克",
            Ireland: "爱尔兰",
            Israel: "以色列",
            Italy: "意大利",
            "Ivory Coast": "象牙海岸",
            Jamaica: "牙买加",
            Japan: "日本",
            Jordan: "乔丹",
            Kashmir: "克什米尔",
            Kazakhstan: "哈萨克斯坦",
            Kenya: "肯尼亚",
            Kosovo: "科索沃",
            Kuwait: "科威特",
            Kyrgyzstan: "吉尔吉斯斯坦",
            "Lao PDR": "老挝",
            Latvia: "拉脱维亚",
            Lebanon: "黎巴嫩",
            Lesotho: "莱索托",
            Liberia: "利比里亚",
            Libya: "利比亚",
            Lithuania: "立陶宛",
            Luxembourg: "卢森堡",
            Madagascar: "马达加斯加",
            Macedonia: "马其顿",
            Malawi: "马拉维",
            Malaysia: "马来西亚",
            Mali: "马里",
            Mauritania: "毛里塔尼亚",
            Mexico: "墨西哥",
            Moldova: "摩尔多瓦",
            Mongolia: "蒙古",
            Montenegro: "黑山",
            Morocco: "摩洛哥",
            Mozambique: "莫桑比克",
            Myanmar: "缅甸",
            Namibia: "纳米比亚",
            Netherlands: "荷兰",
            "New Caledonia": "新喀里多尼亚",
            "New Zealand": "新西兰",
            Nepal: "尼泊尔",
            Nicaragua: "尼加拉瓜",
            Niger: "尼日尔",
            Nigeria: "尼日利亚",
            Korea: "朝鲜",
            "Northern Cyprus": "北塞浦路斯",
            Norway: "挪威",
            Oman: "阿曼",
            Pakistan: "巴基斯坦",
            Panama: "巴拿马",
            "Papua New Guinea": "巴布亚新几内亚",
            Paraguay: "巴拉圭",
            Peru: "秘鲁",
            Philippines: "菲律宾",
            Poland: "波兰",
            Portugal: "葡萄牙",
            "Puerto Rico": "波多黎各",
            Qatar: "卡塔尔",
            "Republic of Serbia": "塞尔维亚共和国",
            Romania: "罗马尼亚",
            Russia: "俄罗斯",
            Rwanda: "卢旺达",
            Samoa: "萨摩亚",
            "Saudi Arabia": "沙特阿拉伯",
            Senegal: "塞内加尔",
            Serbia: "塞尔维亚",
            "Sierra Leone": "塞拉利昂",
            Slovakia: "斯洛伐克",
            Slovenia: "斯洛文尼亚",
            "Solomon Is.": "所罗门群岛",
            Somaliland: "索马里兰",
            Somalia: "索马里",
            "South Africa": "南非",
            "S. Geo. and S. Sandw. Is.": "南乔治亚和南桑德威奇群岛",
            "S. Sudan": "南苏丹",
            Spain: "西班牙",
            "Sri Lanka": "斯里兰卡",
            Sudan: "苏丹",
            Suriname: "苏里南",
            Swaziland: "斯威士兰",
            Sweden: "瑞典",
            Switzerland: "瑞士",
            Syria: "叙利亚",
            Tajikistan: "塔吉克斯坦",
            Tanzania: "坦桑尼亚",
            Thailand: "泰国",
            "Timor-Leste": "东帝汶",
            Togo: "多哥",
            "Trinidad and Tobago": "特立尼达和多巴哥",
            Tunisia: "突尼斯",
            Turkey: "土耳其",
            Turkmenistan: "土库曼斯坦",
            Uganda: "乌干达",
            Ukraine: "乌克兰",
            "United Arab Emirates": "阿拉伯联合酋长国",
            "United Kingdom": "英国",
            "United Republic of Tanzania": "坦桑尼亚联合共和国",
            "United States": "美国",
            "United States of America": "美利坚合众国",
            Uruguay: "乌拉圭",
            Uzbekistan: "乌兹别克斯坦",
            Vanuatu: "瓦努阿图",
            Venezuela: "委内瑞拉",
            Vietnam: "越南",
            "West Bank": "西岸",
            "W. Sahara": "西撒哈拉",
            Yemen: "也门共和国",
            Zambia: "赞比亚共和国",
            Zimbabwe: "津巴布韦"
          },
          data: []
        }
      },

      bubbleMapData: [],
      bubbleMapOption: {
        // backgroundColor: ,
        title: {
          fontWeight: "lighter",
          text: "注：因信息差别较大，x轴与y轴采取取自然对数的表示法，图示半径为死亡率",
          left: "center",
          y: "bottom"
        },

        xAxis: {
          // type: "log",
          // 是否约束待定
          // min: -100,
          max: 16,

          name: "ln(累计确诊)",
          // nameLocation: "middle",
          splitLine: {
            // show: false
            lineStyle: {
              type: "dashed"
            }
          }
        },
        yAxis: {
          // type: "log",
          name: "ln(现存确诊)",
          max: 15,
          min: -1,
          // min: -100,
          splitLine: {
            // show: false
            lineStyle: {
              type: "dashed"
            }
          }
          // scale: true
        },
        series: [
          {
            name: "死亡率",
            data: this.bubbleMapData,
            type: "scatter",
            symbolSize: this.sizeFunction,
            itemStyle: {
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: "rgb(129, 227, 238,0.8)"
                },
                {
                  offset: 1,
                  color: "rgb(25, 183, 207,0.8)"
                }
              ])
            }
          }
        ],
        tooltip: {
          trigger: "item",
          formatter: function(param) {
            return (
              "国家/地区：" +
              param.data[6] +
              "<br/>" +
              "累计确诊人数：" +
              param.data[2] +
              "<br/>" +
              "现存确诊人数：" +
              param.data[3] +
              "<br/>" +
              "死亡率：" +
              param.data[4] +
              "%<br/>" +
              "当日新增确诊病例：" +
              param.data[5] +
              "<br/>"
            );
          }
        }
      },

      linedata: {
        series: [
          { chinadata: [], hubeidata: [] },
          { chinadata: [], hubeidata: [] },
          { chinadata: [], hubeidata: [] },
          { chinadata: [], hubeidata: [] },
          { chinadata: [], hubeidata: [] },
          { chinadata: [], hubeidata: [] }
        ],
        dateId: [],
        linemode: 0
      },

      linegraphoption: {
        tooltip: {
          trigger: "axis",
          formatter: null
        },
        legend: {
          //设置区分（哪条线属于什么）
          data: ["全国", "湖北", "其他"],
          left: "right"
        },
        color: ["#DF0101", "#0000FF", "#FFBF00"], //设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: {
          //设置x轴
          type: "category",
          boundaryGap: false, //坐标轴两边不留白
          splitLine: {
            show: false
          },
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: null
          }
        },
        series: [
          {
            name: "全国",
            data: [],
            type: "line", // 类型为折线图
            symbol: "none",
            smooth: true,
            lineStyle: {
              // 线条样式 => 必须使用normal属性
              normal: {
                color: "#DF0101"
              }
            }
          },
          {
            name: "湖北",
            data: [],
            type: "line",
            symbol: "none",
            smooth: true,
            lineStyle: {
              normal: {
                color: "#0000FF"
              }
            }
          },
          {
            name: "其他",
            data: [],
            type: "line",
            symbol: "none",
            smooth: true,
            lineStyle: {
              normal: {
                color: "#FFBF00"
              }
            }
          }
        ],
        dataZoom: [
          {
            type: "inside",
            orient: "horizontal",
            xAxisIndex: 0,
            minValueSpan: 5
          },
          {
            type: "slider"
          }
        ]
      },

      schema: [
        { name: "国家", index: 0, text: "国家", unit: "" },
        { name: "累计确诊", index: 1, text: "累计确诊", unit: "例" },
        { name: "现存确诊", index: 2, text: "现存确诊", unit: "例" },
        { name: "死亡率", index: 3, text: "死亡率", unit: "%" }
      ],

      tabheader: [
        {
          text: "疫情地区",
          align: "center",
          sortable: false,
          value: "name"
        },
        { text: "现存确诊", value: "current" },
        { text: "累计确诊", value: "total" },
        { text: "现存疑似", value: "suspect" },
        { text: "境外输入", value: "abroad" },
        { text: "治愈", value: "cure" },
        { text: "死亡", value: "death" },
        { text: "", value: "data-table-expand" }
      ],
      cityHeader: [
        {
          text: "城市/地区名称",
          value: "name"
        },
        { text: "现存确诊", value: "curConfirmed" },
        { text: "累计确诊", value: "cumuConfirmed" },
        { text: "现存疑似", value: "curSuspected" },
        { text: "治愈", value: "cumuCured" },
        { text: "死亡", value: "cumuDead" }
      ],
      worldHeader: [
        { text: "国家/地区名称", value: "countryName" },
        { text: "所属大洲/地区", value: "continents" },
        { text: "现存确诊", value: "currentConfirmedCount" },
        { text: "累计确诊", value: "confirmedCount" },
        { text: "累计治愈", value: "curedCount" },
        { text: "累计死亡", value: "deadCount" }
      ],
      USAHeader: [
        { text: "州名称", value: "provinceName" },
        { text: "现存确诊", value: "currentConfirmedCount" },
        { text: "现存疑似", value: "suspectedCount" },
        { text: "累计确诊", value: "confirmedCount" },
        { text: "累计治愈", value: "curedCount" },
        { text: "累计死亡", value: "deadCount" }
      ],

      provinces: [],
      cities: [],
      filteredCities: [],
      countryData: [],
      USAProvinceData: [],

      taboption: {
        sortBy: ["total"],
        sortDesc: [true]
      }
    };
  },
  created() {
    this.getProvinceData();
    this.getDataforLinegraph();
    this.getCountryData();
    this.getUSAProvinceData();

    // 获取城市信息以供调用
    this.getCityData();
  },

  mounted() {
    this.drawmap();
    this.drawlinegraph();
    this.drawBubbleMap();
  },

  beforeDestroy() {
    // 清理工作，避免内存泄漏
    // window.removeEventListener('resize', sizeFun1)
    // window.removeEventListener('resize', sizeFun2)
  },

  methods: {
    setCN() {
      if (!this.selectedCN) {
        document.getElementById("cn_info").scrollIntoView();
      }
      this.selectedCN = true;
    },
    unsetCN() {
      if (this.selectedCN) {
        document.getElementById("world_info").scrollIntoView();
      }
      this.selectedCN = false;
    },

    // 改成bmob
    getCityData() {
      this.getProvinceList.forEach(pname => {
        var query = Bmob.Query("cities_stats");
        query.limit(1311);
        query.equalTo("provinceName", "==", pname);
        query.find().then(res => {
          // console.log(res.length);
          res.forEach(v => {
            var index = this.getProvinceList.indexOf(v.provinceName);
            if (this.filteredCities[index] == undefined) {
              this.filteredCities[index] = new Array();
            }
            this.filteredCities[index].push(v);
          });
        });
      });
    },
    test() {
      console.log(this.filteredCities);
    },

    getProvinceData() {
      const query = Bmob.Query("province_stats");
      query.find().then(res => {
        // console.log(res);
        var mapdata = new Array();
        var tabledata = new Array();
        for (var x in res) {
          var mapitem = {
            name: res[x].name,
            value: res[x].cumuConfirmed,
            cumuConfirmed: res[x].cumuConfirmed,
            curConfirmed: res[x].curConfirmed,
            cured: res[x].cumuCured,
            dead: res[x].cumuDead,
            income: res[x].incomeNum
          };
          var tableitem = {
            name: res[x].name,
            current: res[x].curConfirmed,
            total: res[x].cumuConfirmed,
            abroad: res[x].incomeNum,
            suspect: res[x].curSuspected,
            cure: res[x].cumuCured,
            death: res[x].cumuDead
          };
          mapdata.push(mapitem);
          tabledata.push(tableitem);
        }
        mapdata.push({
          name: "南海诸岛",
          value: 0,
          cumuConfirmed: 0,
          curConfirmed: 0,
          cured: 0,
          dead: 0
        });
        this.mapOption.series.data = mapdata;
        this.provinces = tabledata;

        // console.log(tabledata)
      });
    },

    getCountryData() {
      const query = Bmob.Query("country_stats");
      query.limit(300);
      query.find().then(res => {
        // console.log(res);
        var tmpdata = [];
        for (var x in res) {
          var tmpitem = {
            name: res[x].name,
            value: res[x].curConfirmed
          };
          tmpdata.push(tmpitem);
        }
        // console.log(tmpdata);
        this.worldmapOption.series.data = tmpdata;
      });

      this.axios.get("http://111.231.75.86:8000/api/countries").then(res => {
        this.countryData = res.data;

        // console.log("get the data for bubble map")
        var tmpbubbledata = [];
        res.data.forEach(v => {
          var x = [];
          x.push(Math.log(v.confirmedCount));
          x.push(Math.log(v.currentConfirmedCount));
          x.push(v.confirmedCount);
          x.push(v.currentConfirmedCount);
          x.push(Number((v.deadCount / v.confirmedCount) * 100).toFixed(2));
          x.push(v.incrVo.confirmedIncr);
          x.push(v.countryName);
          tmpbubbledata.push(x);
        });

        this.bubbleMapData = tmpbubbledata;
        console.log(this.bubbleMapData);
      });
    },

    getUSAProvinceData() {
      this.axios
        .get("http://111.231.75.86:8000/api/provinces/USA/daily")
        .then(res => {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            if (
              i == data.length - 1 ||
              data[i + 1].provinceCode != data[i].provinceCode
            ) {
              if (data[i].suspectedCount == null) {
                data[i].suspectedCount = 0;
                if (data[i].curedCount == null) {
                  data[i].curedCount =
                    data[i].confirmedCount -
                    data[i].currentConfirmedCount -
                    data[i].suspectedCount -
                    data[i].deadCount;
                  if (data[i].curedCount < 0 || data[i].curedCount == null)
                    data[i].curedCount = 0;
                }
                data[i].suspectedCount = "未公布/未统计";
              }
              if (data[i].provinceName == "Florida") {
                // console.log("bad guy");
                console.log(data[i]);
                data[i].curedCount = 0;
              }
              this.USAProvinceData.push(data[i]);
            }
          }
        });
    },

    getDataforLinegraph() {
      var tmplinedata = this.linedata;
      // console.log(tmplinedata)

      const qchinadaily = Bmob.Query("country_daily");
      qchinadaily.equalTo("name", "==", "中国");
      qchinadaily.find().then(res => {
        // console.log(res)
        for (var x = 1; x < res[0].cumuConfirmed.length; x++) {
          tmplinedata.series[1].chinadata.push(res[0].cumuConfirmed[x]);
          tmplinedata.series[0].chinadata.push(res[0].curConfirmed[x]);
          tmplinedata.series[3].chinadata.push(res[0].cumuCured[x]);
          tmplinedata.series[4].chinadata.push(res[0].cumuDead[x]);
          tmplinedata.dateId.push(this.formatDate(res[0].dateId[x]));
        }
      });

      const qhubeidaily = Bmob.Query("province_daily");
      qhubeidaily.equalTo("name", "==", "湖北");
      qhubeidaily.find().then(res => {
        // console.log(res)
        for (var x in res[0].cumuConfirmed) {
          tmplinedata.series[1].hubeidata.push(res[0].cumuConfirmed[x]);
          tmplinedata.series[0].hubeidata.push(res[0].curConfirmed[x]);
          tmplinedata.series[3].hubeidata.push(res[0].cumuCured[x]);
          tmplinedata.series[4].hubeidata.push(res[0].cumuDead[x]);
        }
      });

      const qchinaincr = Bmob.Query("country_incr");
      qchinaincr.equalTo("name", "==", "中国");
      qchinaincr.find().then(res => {
        // console.log(res)
        for (var x = 1; x < res[0].cumuConfirmedIncr.length; x++) {
          tmplinedata.series[2].chinadata.push(res[0].cumuConfirmedIncr[x]);
        }
      });

      const qhubeiincr = Bmob.Query("province_incr");
      qhubeiincr.equalTo("name", "==", "湖北");
      qhubeiincr.find().then(res => {
        // console.log(res)
        for (var x in res[0].cumuConfirmedIncr) {
          tmplinedata.series[2].hubeidata.push(res[0].cumuConfirmedIncr[x]);
        }
      });

      this.linedata = tmplinedata;
    },

    formatDate(val) {
      var res = "";
      var tmp = val.toString();
      res += tmp.substr(4, 2) + "." + tmp.substr(6, 2);
      return res;
    },

    drawmap() {
      console.log("drawmap");
      let mapChart = this.$echarts.init(document.getElementById("mapchart"));
      mapChart.setOption(this.mapOption, true);
      //图表随窗口自适应
      let sizeFun1 = function() {
        mapChart.resize();
      };
      window.addEventListener("resize", sizeFun1);
    },

    mapselectChange(value) {
      // console.log(value)
      if (value == 0) {
        var tmp = this.mapOption.series.data;
        for (var x in tmp) {
          tmp[x].value = tmp[x].cumuConfirmed;
        }
        this.mapOption.series.data = tmp;
        this.mapOption.tooltip.formatter = function(params) {
          // console.log(params);
          var res = "";
          res = params.data.name + "<br/>";
          res += "累计确诊: " + params.data.cumuConfirmed + "<br/>";
          res += "现存确诊: " + params.data.curConfirmed + "<br/>";
          res += "累计治愈: " + params.data.cured + "<br/>";
          res += "累计死亡: " + params.data.dead;
          return res;
        };
      } else if (value == 1) {
        tmp = this.mapOption.series.data;
        for (x in tmp) {
          tmp[x].value = tmp[x].curConfirmed;
        }
        this.mapOption.series.data = tmp;
        this.mapOption.tooltip.formatter = function(params) {
          // console.log(params);
          var res = "";
          res = params.data.name + "<br/>";
          res += "累计确诊: " + params.data.cumuConfirmed + "<br/>";
          res += "现存确诊: " + params.data.curConfirmed + "<br/>";
          res += "累计治愈: " + params.data.cured + "<br/>";
          res += "累计死亡: " + params.data.dead;
          return res;
        };
      } else if (value == 2) {
        // 改变可视化的绑定数据
        tmp = this.mapOption.series.data;
        for (x in tmp) {
          tmp[x].value = tmp[x].income;
        }
        this.mapOption.series.data = tmp;
        // 更新悬浮窗提示
        this.mapOption.tooltip.formatter = function(params) {
          // console.log(params);
          var res = "";
          res = params.data.name + "<br/>";
          res += "境外输入: " + params.data.income + "<br/>";
          return res;
        };
      }
    },

    worldSelectedChange(value) {
      this.whichWorldMap = value;
    },

    worldTableChange(value) {
      this.whichWorldTable = value;
    },

    drawworldmap() {
      console.log("draw world map");
      let worldMap = this.$echarts.init(document.getElementById("worldmap"));
      worldMap.setOption(this.worldmapOption, true);
      // 自适应
      let sizeFun3 = function() {
        worldMap.resize();
      };
      window.addEventListener("resize", sizeFun3);
    },

    drawBubbleMap() {
      console.log("draw BubbleMap");
      let bubbleMap = this.$echarts.init(document.getElementById("bubbleMap"));
      bubbleMap.setOption(this.bubbleMapOption, true);
      window.addEventListener("resize", () => {
        bubbleMap.resize();
      });
    },
    sizeFunction(x, y) {
      // var y = Math.sqrt(x / 5e8) + 0.1;
      // return y * 80;
      // console.log(x);

      return parseFloat(x[4] + y.seriesIndex * 0) * 5;
    },

    drawlinegraph() {
      console.log("drawlinegraph");
      let lineGraph = this.$echarts.init(document.getElementById("linegraph"));
      lineGraph.setOption(this.linegraphoption, true);
      //图表随窗口自适应
      let sizeFun2 = function() {
        lineGraph.resize();
      };
      window.addEventListener("resize", sizeFun2);
    },

    lineselectChange(value) {
      // console.log(value)
      // console.log(this.linedata)
      if (value == 5 && this.linedata.series[5].chinadata.length == 0) {
        var tmp1 = [],
          tmp2 = [];
        var pseries = this.linedata.series;
        for (var x in pseries[1].hubeidata) {
          tmp1.push(pseries[3].chinadata[x] / pseries[1].chinadata[x]);
          tmp2.push(pseries[4].chinadata[x] / pseries[1].chinadata[x]);
        }
        var tmpdata = {
          chinadata: tmp1,
          hubeidata: tmp2
        };
        pseries[5] = tmpdata;
      }

      if (value == 5) {
        this.linegraphoption.legend.data = ["治愈率", "死亡率"];
        this.linegraphoption.color = ["#0000FF", "#DF0101"];
        this.linegraphoption.series[0].name = "治愈率";
        this.linegraphoption.series[0].lineStyle.normal.color = "#0000FF";
        this.linegraphoption.series[1].name = "死亡率";
        this.linegraphoption.series[1].lineStyle.normal.color = "#DF0101";
        this.linegraphoption.series[2].data = [];
        this.linegraphoption.yAxis.axisLabel.formatter = function(value) {
          return (value * 100).toFixed(2) + "%";
        };
        this.linegraphoption.tooltip.formatter = function(params) {
          // console.log(params)
          var res = params[0].axisValue + "<br/>";
          res +=
            params[0].marker +
            params[0].seriesName +
            ": " +
            (params[0].value * 100).toFixed(2) +
            "% <br/>";
          res +=
            params[1].marker +
            params[1].seriesName +
            ": " +
            (params[1].value * 100).toFixed(2) +
            "%";

          return res;
        };
      } else {
        this.linegraphoption.legend.data = ["全国", "湖北", "其他"];
        this.linegraphoption.color = ["#DF0101", "#0000FF", "#FFBF00"];
        this.linegraphoption.series[0].name = "全国";
        this.linegraphoption.series[0].lineStyle.normal.color = "#DF0101";
        this.linegraphoption.series[1].name = "湖北";
        this.linegraphoption.series[1].lineStyle.normal.color = "#0000FF";
        this.linegraphoption.yAxis.axisLabel.formatter = null;
        this.linegraphoption.tooltip.formatter = null;
      }

      this.linedata.linemode = value;
    }
  },

  watch: {
    //观察option的变化
    mapOption: {
      handler() {
        // console.log(this.mapOption)
        this.drawmap();
      },
      deep: true //对象内部属性的监听，关键。
    },

    linedata: {
      deep: true,
      handler() {
        var tmp = [];
        this.linegraphoption.xAxis.data = this.linedata.dateId;
        this.linegraphoption.series[0].data = this.linedata.series[
          this.linedata.linemode
        ].chinadata;
        this.linegraphoption.series[1].data = this.linedata.series[
          this.linedata.linemode
        ].hubeidata;
        var pseries = this.linedata.series;
        var pmode = this.linedata.linemode;
        if (pmode < 5) {
          for (var x in pseries[pmode].hubeidata) {
            if (pseries[pmode].chinadata[x] < pseries[pmode].hubeidata[x]) {
              pseries[pmode].chinadata[x] = pseries[pmode].hubeidata[x];
            }
            tmp.push(pseries[pmode].chinadata[x] - pseries[pmode].hubeidata[x]);
          }
          this.linegraphoption.series[2].data = tmp;
        }
        this.drawlinegraph();
      }
    },

    worldmapOption: {
      deep: true,
      handler() {
        this.drawworldmap();
      }
    },

    bubbleMapData: {
      deep: true,
      handler() {
        this.bubbleMapOption.series[0].data = this.bubbleMapData;
        this.drawBubbleMap();
      }
    }
  }
};
</script>