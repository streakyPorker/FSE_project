<template>
  <div>
    <!--为Echart准备的容器-->
    <div id="mapchart" :style="{width: '80%', height: '500px'}"></div>
    <v-btn-toggle
      mandatory
      :value="0"
      @change="mapselectChange"
    >
      <v-btn :value="0">累计确诊</v-btn>

      <v-btn :value="1">现存确诊</v-btn>

      <v-btn :value="2">境外输入</v-btn>
    </v-btn-toggle>
    <div id="linegraph" :style="{width: '80%', height: '500px'}"></div> 
    <v-btn-toggle
      mandatory
      :value="0"
      @change="lineselectChange"
    >
      <v-btn :value="0">现存确诊</v-btn>

      <v-btn :value="1">累计确诊</v-btn>

      <v-btn :value="2">每日新增</v-btn>
      
      <v-btn :value="3">累计治愈</v-btn>

      <v-btn :value="4">累计死亡</v-btn>

      <v-btn :value="5">治愈率/死亡率</v-btn>
    </v-btn-toggle>
    <v-data-table
      :headers="tabheader"
      :items="provinces"
      :options="taboption"
      class="elevation-1"
    >
    </v-data-table>
  </div>
</template>

<script>
import Vue from 'vue'
import Bmob from 'hydrogen-js-sdk'
import echarts from 'echarts'
import 'echarts/map/js/china.js'
Vue.prototype.$echarts = echarts  //设置全局属性

export default {
  data() {
    return {
      mapOption:{
        title: {
          text: '全国疫情地图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params){
            // console.log(params);
            var res = '';
            res = params.data.name + '<br/>';
            res += '累计确诊: ' + params.data.cumuConfirmed + '<br/>';
            res += '现存确诊: ' + params.data.curConfirmed + '<br/>';
            res += '累计治愈: ' + params.data.cured + '<br/>';
            res += '累计死亡: ' + params.data.dead;
            return res;
          }
        },
        visualMap: {
          type: 'piecewise',
          // dimension: 1,
          pieces: [
            { min: 5000, label: '5000以上', color: '#A13314' },
            { min: 1000, max: 4999, label: '1000~4999', color: '#CC5D32' },
            { min: 500, max: 999, label: '500-999', color: '#E87537' },
            { min: 100, max: 499, label: '100-499', color: '#EBB158' },
            { min: 10, max: 99, label: '10-99', color: '#F5DA81' },
            { min: 1, max: 9, label: '1-9', color: '#F3E2A9' },
            { max: 0, label: '0', color: '#F7F2E0'}
          ],
          color: ['#E0022B', '#E09107', '#A3E00B']
        },
        series: {
            name: '累计确诊',
            type: 'map',
            map: 'china',
            roam: false,
            label: {
              show: true,
              color: '#1C1C1C'
            },
            data: []
        }
      },

      linedata: {
        series: [
          {chinadata: [], hubeidata: []},
          {chinadata: [], hubeidata: []},
          {chinadata: [], hubeidata: []},
          {chinadata: [], hubeidata: []},
          {chinadata: [], hubeidata: []},
          {chinadata: [], hubeidata: []}
        ],
        dateId: [],
        linemode: 0
      },

      linegraphoption:{
        title:{
          text: '疫情趋势图',
          left: 'center'
        },
        tooltip: {        
          trigger: 'axis',
          formatter: null
        },
        legend: {               //设置区分（哪条线属于什么）
          data:['全国', '湖北', '其他'],
          left: 'right'
        },
        color: ['#DF0101', '#0000FF', '#FFBF00'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: {                //设置x轴
          type: 'category',
          boundaryGap: false,     //坐标轴两边不留白
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLabel:{
            formatter: null
          }
        },
        series: [
          {
            name: '全国',
            data:  [],
            type: 'line',               // 类型为折线图
            symbol: 'none',
            smooth: true,
            lineStyle: {                // 线条样式 => 必须使用normal属性
                normal: {
                    color: '#DF0101',
                }
            },
          },
          {
            name: '湖北',
            data: [],
            type: 'line',
            symbol: 'none',
            smooth: true,
            lineStyle: {
                normal: {
                    color: '#0000FF',
                }
            },
          },
          {
            name: '其他',
            data: [],
            type: 'line',
            symbol: 'none',
            smooth: true,
            lineStyle: {
                normal: {
                    color: '#FFBF00',
                }
            },
          }
        ],
        dataZoom: [{
          type: 'inside',
          orient: 'horizontal',
          xAxisIndex: 0,
          minValueSpan: 5,

        },{
          type: 'slider'
        }]
      },

      tabheader: [
        {
          text: '疫情地区',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: '现存确诊', value: 'current' },
        { text: '累计确诊', value: 'total' },
        { text: '现存疑似', value: 'suspect'},
        { text: '境外输入', value: 'abroad' },
        { text: '治愈', value: 'cure' },
        { text: '死亡', value: 'death' },
      ],

      provinces: [],

      taboption: {
        sortBy: ['total'],
        sortDesc: [true],
      },
    }
  },
  created(){
    this.getProvinceData();
    this.getDataforLinegraph();
  },

  mounted(){
    this.drawmap();
    this.drawlinegraph();
  },

  beforeDestroy(){  // 清理工作，避免内存泄漏
    // window.removeEventListener('resize', sizeFun1)
    // window.removeEventListener('resize', sizeFun2)
  },

  methods:{
    getProvinceData(){
      const query = Bmob.Query("province_stats");
      query.find().then(res => {
        // console.log(res);
        var mapdata = new Array()
        var tabledata = new Array()
        for (var x in res)
        {
          var mapitem = {
            name: res[x].name,
            value: res[x].cumuConfirmed,
            cumuConfirmed: res[x].cumuConfirmed,
            curConfirmed: res[x].curConfirmed,
            cured: res[x].cumuCured,
            dead: res[x].cumuDead
          }
          var tableitem = {
            name: res[x].name,
            current: res[x].curConfirmed,
            total: res[x].cumuConfirmed,
            abroad: 0,
            suspect: res[x].curSuspected,
            cure: res[x].cumuCured,
            death: res[x].cumuDead
          }
          mapdata.push(mapitem)
          tabledata.push(tableitem)
        }
        mapdata.push({
          name: '南海诸岛',
          value: 0,
          cumuConfirmed: 0,
          curConfirmed: 0,
          cured: 0,
          dead: 0});
        this.mapOption.series.data = mapdata
        this.provinces = tabledata
      });
    },

    getDataforLinegraph(){
      var tmplinedata = this.linedata
      // console.log(tmplinedata)

      const qchinadaily = Bmob.Query("country_daily");
      qchinadaily.equalTo("name", "==", "中国");
      qchinadaily.find().then(res => {
        // console.log(res)
        for (var x = 1; x < res[0].cumuConfirmed.length; x++){
          tmplinedata.series[1].chinadata.push(res[0].cumuConfirmed[x])
          tmplinedata.series[0].chinadata.push(res[0].curConfirmed[x])
          tmplinedata.series[3].chinadata.push(res[0].cumuCured[x])
          tmplinedata.series[4].chinadata.push(res[0].cumuDead[x])
          tmplinedata.dateId.push(this.formatDate(res[0].dateId[x]))
        }
      })

      const qhubeidaily = Bmob.Query("province_daily");
      qhubeidaily.equalTo("name", "==", "湖北");
      qhubeidaily.find().then(res => {
        // console.log(res)
        for (var x in res[0].cumuConfirmed){
          tmplinedata.series[1].hubeidata.push(res[0].cumuConfirmed[x])
          tmplinedata.series[0].hubeidata.push(res[0].curConfirmed[x])
          tmplinedata.series[3].hubeidata.push(res[0].cumuCured[x])
          tmplinedata.series[4].hubeidata.push(res[0].cumuDead[x])
        }
      })

      const qchinaincr = Bmob.Query("country_incr");
      qchinaincr.equalTo("name", "==", "中国");
      qchinaincr.find().then(res => {
        // console.log(res)
        for (var x = 1; x < res[0].cumuConfirmedIncr.length; x++){
          tmplinedata.series[2].chinadata.push(res[0].cumuConfirmedIncr[x])
        }
      })

      const qhubeiincr = Bmob.Query("province_incr");
      qhubeiincr.equalTo("name", "==", "湖北");
      qhubeiincr.find().then(res => {
        // console.log(res)
        for (var x in res[0].cumuConfirmedIncr){
          tmplinedata.series[2].hubeidata.push(res[0].cumuConfirmedIncr[x])
        }
      })

      this.linedata = tmplinedata
    },

    formatDate(val){
      var res = ''
      var tmp = val.toString()
      res += tmp.substr(4,2) + '.' + tmp.substr(6,2)
      return res
    },

    drawmap(){
      console.log('drawmap')
      let mapChart = this.$echarts.init(document.getElementById('mapchart'));
      mapChart.setOption(this.mapOption, true);
      //图表随窗口自适应
      let sizeFun1 = function () {
        mapChart.resize()
      }
      window.addEventListener('resize', sizeFun1 )
    },

    mapselectChange(value){
      // console.log(value)
      if (value == 0){
        var tmp = this.mapOption.series.data
        for (var x in tmp){
          tmp[x].value = tmp[x].cumuConfirmed
        }
        this.mapOption.series.data = tmp
      }
      else if (value == 1){
        tmp = this.mapOption.series.data
        for (x in tmp){
          tmp[x].value = tmp[x].curConfirmed
        }
        this.mapOption.series.data = tmp
      }
    },

    drawlinegraph(){
      console.log('drawlinegraph')
      let lineGraph = this.$echarts.init(document.getElementById('linegraph'));
      lineGraph.setOption(this.linegraphoption, true);
      //图表随窗口自适应
      let sizeFun2 = function () {
        lineGraph.resize()
      }
      window.addEventListener('resize', sizeFun2 )
    },

    lineselectChange(value){
      // console.log(value)
      // console.log(this.linedata)
      if (value == 5 && this.linedata.series[5].chinadata.length == 0)
      {
        var tmp1 = [], tmp2 = []
        var pseries = this.linedata.series
        for (var x in pseries[1].hubeidata){
          tmp1.push(pseries[3].chinadata[x]/pseries[1].chinadata[x])
          tmp2.push(pseries[4].chinadata[x]/pseries[1].chinadata[x])
        }
        var tmpdata = {
          chinadata: tmp1,
          hubeidata: tmp2
        }
        pseries[5] = tmpdata
      }

      if (value == 5){
        this.linegraphoption.legend.data = ['治愈率', '死亡率']
        this.linegraphoption.color = ['#0000FF', '#DF0101']
        this.linegraphoption.series[0].name = '治愈率'
        this.linegraphoption.series[0].lineStyle.normal.color = '#0000FF'
        this.linegraphoption.series[1].name = '死亡率'
        this.linegraphoption.series[1].lineStyle.normal.color = '#DF0101'
        this.linegraphoption.series[2].data = []
        this.linegraphoption.yAxis.axisLabel.formatter = function(value){
          return (value*100).toFixed(2)+'%';
        }
        this.linegraphoption.tooltip.formatter = function (params) {
          // console.log(params)
          var res = params[0].axisValue + '<br/>'
          res += params[0].marker + params[0].seriesName + ': ' + (params[0].value*100).toFixed(2)+'% <br/>'
          res += params[1].marker + params[1].seriesName + ': ' + (params[1].value*100).toFixed(2)+'%'
          
          return res;
        }
      }
      else {
        this.linegraphoption.legend.data = ['全国', '湖北', '其他']
        this.linegraphoption.color = ['#DF0101', '#0000FF', '#FFBF00']
        this.linegraphoption.series[0].name = '全国'
        this.linegraphoption.series[0].lineStyle.normal.color = '#DF0101'
        this.linegraphoption.series[1].name = '湖北'
        this.linegraphoption.series[1].lineStyle.normal.color = '#0000FF'
        this.linegraphoption.yAxis.axisLabel.formatter = null;
        this.linegraphoption.tooltip.formatter = null;
      }

      this.linedata.linemode = value
    },
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
        var tmp = []
        this.linegraphoption.xAxis.data = this.linedata.dateId
        this.linegraphoption.series[0].data = this.linedata.series[this.linedata.linemode].chinadata
        this.linegraphoption.series[1].data = this.linedata.series[this.linedata.linemode].hubeidata
        var pseries = this.linedata.series
        var pmode = this.linedata.linemode
        if (pmode < 5){
          for (var x in pseries[pmode].hubeidata)
          {
            if (pseries[pmode].chinadata[x] < pseries[pmode].hubeidata[x]){
              pseries[pmode].chinadata[x] = pseries[pmode].hubeidata[x]
            }
            tmp.push(pseries[pmode].chinadata[x] - pseries[pmode].hubeidata[x]) 
          }
          this.linegraphoption.series[2].data = tmp
        }
        this.drawlinegraph();
      }
    },
  },
}
</script>