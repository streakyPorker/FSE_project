import axios from 'axios'
import Bmob from 'hydrogen-js-sdk'

const countryListQuery = Bmob.Query('countryList')
const countryQuery = Bmob.Query('country')
const provinceQuery = Bmob.Query('province')

const countryStatsQuery = Bmob.Query('country_stats')
const provinceStatsQuery = Bmob.Query('province_stats')
const citiesStatsQuery = Bmob.Query('cities_stats')

const countryIncrQuery = Bmob.Query('country_incr')
const provinceIncrQuery = Bmob.Query('province_incr')

const countryDailyQuery = Bmob.Query('country_daily')
const provinceDailyQuery = Bmob.Query('province_daily')


const provinceList = ["上海", "云南", "内蒙古", "北京", "台湾", "吉林", "四川", "天津", "宁夏",
    "安徽", "山东", "山西", "广东", "广西", "新疆", "江苏", "江西", "河北", "河南", "浙江", "海南",
    "湖北", "湖南", "澳门", "甘肃", "福建", "西藏", "贵州", "辽宁", "重庆", "陕西", "青海", "香港",
    "黑龙江"]

const countryList = ["阿富汗", "阿联酋", "亚美尼亚", "阿塞拜疆", "孟加拉国", "巴林", "文莱", "不丹", "中国", "塞浦路斯", "格鲁吉亚",
    "印度尼西亚", "印度", "伊朗", "伊拉克", "以色列", "约旦", "日本", "哈萨克斯坦", "吉尔吉斯斯坦", "柬埔寨", "韩国", "科威特",
    "老挝", "黎巴嫩", "斯里兰卡", "马尔代夫", "缅甸", "蒙古", "马来西亚", "尼泊尔", "阿曼", "巴基斯坦", "菲律宾", "巴勒斯坦",
    "卡塔尔", "沙特阿拉伯", "新加坡", "叙利亚", "泰国", "塔吉克斯坦", "东帝汶", "土耳其", "乌兹别克斯坦", "越南", "也门共和国",
    "钻石公主号邮轮", "阿鲁巴", "安圭拉", "安提瓜和巴布达", "巴哈马", "圣巴泰勒米岛", "伯利兹", "百慕大", "巴巴多斯", "加拿大",
    "哥斯达黎加", "古巴", "库拉索岛", "开曼群岛", "多米尼克", "多米尼加", "瓜德罗普岛", "格林那达", "格陵兰", "危地马拉", "洪都拉斯",
    "海地", "牙买加", "圣其茨和尼维斯", "圣卢西亚", "墨西哥", "蒙特塞拉特", "马提尼克", "尼加拉瓜", "巴拿马", "波多黎各", "萨尔瓦多",
    "圣皮埃尔和密克隆群岛", "圣马丁岛", "荷属圣马丁", "特克斯和凯科斯群岛", "特立尼达和多巴哥", "美国", "美属维尔京群岛",
    "圣文森特和格林纳丁斯", "英属维尔京群岛", "阿根廷", "荷兰加勒比地区", "玻利维亚", "巴西", "智利", "哥伦比亚", "厄瓜多尔",
    "福克兰群岛", "法属圭亚那", "圭亚那", "秘鲁", "巴拉圭", "苏里南", "乌拉圭", "委内瑞拉", "澳大利亚", "北马里亚纳群岛联邦", "斐济",
    "关岛", "新喀里多尼亚", "新西兰", "巴布亚新几内亚", "法属波利尼西亚", "阿尔巴尼亚", "安道尔", "奥地利", "比利时", "保加利亚",
    "波黑", "白俄罗斯", "瑞士", "直布罗陀", "捷克", "德国", "丹麦", "西班牙", "爱沙尼亚", "芬兰", "法罗群岛", "法国", "英国",
    "根西岛", "希腊", "克罗地亚", "匈牙利", "爱尔兰", "冰岛", "意大利", "泽西岛", "列支敦士登", "立陶宛", "卢森堡", "拉脱维亚",
    "摩纳哥", "摩尔多瓦", "北马其顿", "马耳他", "黑山", "马恩岛", "荷兰", "挪威", "波兰", "葡萄牙", "罗马尼亚", "俄罗斯", "圣马力诺",
    "塞尔维亚", "斯洛伐克", "斯洛文尼亚", "瑞典", "乌克兰", "梵蒂冈", "安哥拉", "布隆迪共和国", "贝宁", "布基纳法索", "博茨瓦纳",
    "中非共和国", "科特迪瓦", "喀麦隆", "刚果（金）", "刚果（布）", "科摩罗", "佛得角", "吉布提", "阿尔及利亚", "埃及", "厄立特里亚",
    "埃塞俄比亚", "加蓬", "几内亚比绍", "加纳", "几内亚", "冈比亚", "赤道几内亚", "肯尼亚", "利比里亚", "利比亚", "莱索托", "摩洛哥",
    "马达加斯加", "马里", "莫桑比克", "毛里塔尼亚", "毛里求斯", "马拉维", "马约特", "纳米比亚", "尼日尔", "尼日利亚", "留尼旺",
    "卢旺达", "苏丹", "塞内加尔", "塞拉利昂", "索马里", "南苏丹", "圣多美和普林西比", "斯威士兰", "塞舌尔", "乍得", "多哥",
    "突尼斯", "坦桑尼亚", "乌干达", "南非", "赞比亚共和国", "津巴布韦"]
/*
乌拉圭"
塞内加尔
*/
var data = {
    //(216+34)*120 34*120 
}
// 定时刷新数据方法
var refresh = (interval) => {
    console.log(interval)
}

var test = () => {
    console.log(countryQuery, provinceQuery, data, citiesStatsQuery,
        refresh, countryStatsQuery, provinceStatsQuery, countryIncrQuery,
        provinceIncrQuery, countryDailyQuery, provinceDailyQuery,
        provinceList, countryList)



}


var oneOffFuncs = {
    // 导入国家名称数据
    // 如果选择isLoadStats,则顺道将所有国家的疫情信息导入
    loadCountryNames: (isLoadStats) => {

        axios.get('http://111.231.75.86:8000/api/countries')
            .then(r1 => {
                r1.data.forEach(v => {
                    // 如果选择isLoadStats,则顺道将所有国家的疫情信息导入
                    if (isLoadStats) multiTimesFuncs.loadCountryStats(v.countryName);
                    countryListQuery.set('continents', v.continents)
                    countryListQuery.set('countryName', v.countryName)
                    countryListQuery.save()
                })
            })
    },


    //导入中国的省份名称
    // 如果isLoadStats为真，则顺道导入所有的省份的统计数据
    loadProvinceNames: (isLoadStats) => {
        axios.get('http://111.231.75.86:8000/api/provinces')
            .then(res => {
                // console.log(res)
                res.data.forEach(v => {
                    countryQuery.set('name', '中国')
                    countryQuery.set('province', v.provinceName)
                    countryQuery.set('provinceShortName', v.provinceName)
                    if (isLoadStats) {
                        multiTimesFuncs.loadProvinceStats(v.provinceName)
                    }
                    return countryQuery.save()

                })
            })
    },

    // 导入所有省份下的城市名称信息
    // 如果isLoadStats为真，则顺道导入所有的城市的统计数据
    loadCityNames: (isLoadStats) => {
        countryQuery.equalTo('name', '==', '中国')
        countryQuery.find().then(r1 => {
            console.log(r1)
            r1.forEach(v1 => {
                var url = 'http://111.231.75.86:8000/api/cities/?provinceName=' + v1.province
                axios.get(url).then(r2 => {
                    console.log(r2)
                    r2.data.forEach(v2 => {
                        if (v2.cityName != '境外输入' && v2.cityName != '外地来津') {
                            provinceQuery.set('name', v1.province)
                            provinceQuery.set('cityName', v2.cityName)
                            // 如果选择了isLoadStats,那么将顺道导入城市的疫情数据
                            if (isLoadStats) multiTimesFuncs.loadCityStatsDetail(v2)
                            return provinceQuery.save()
                        }
                    });
                })
            })
        })
    },






}

var multiTimesFuncs = {

    initCities(){
        axios.get('http://111.231.75.86:8000/api/cities/CHN')
        .then(r1=>{
            r1.data.forEach(v1=>{
                citiesStatsQuery.set('provinceName',v1.provinceName)
                citiesStatsQuery.set('name',v1.cityName)
                citiesStatsQuery.set('curConfirmed', v1.currentConfirmedCount)
                citiesStatsQuery.set('cumuConfirmed', v1.confirmedCount)
                citiesStatsQuery.set('curSuspected', v1.suspectedCount)
                citiesStatsQuery.set('cumuCured', v1.curedCount)
                citiesStatsQuery.set('cumuDead', v1.deadCount)
                citiesStatsQuery.save().then(()=>{
                    console.log(v1.cityName+' init done')
                })
            })
        })
    },

    updateCities(province) {
        if (province == 'all') {
           provinceList.forEach(v=>{
               this.updateCities(v)
           })
        }
        else{
            axios.get('http://111.231.75.86:8000/api/cities/CHN/?provinceNames='+province)
            .then(r1 => {
                r1.data.forEach(v1 => {
                    citiesStatsQuery.equalTo('name', '==', v1.cityName)
                    citiesStatsQuery.equalTo('provinceName', '==', v1.provinceName)
                    citiesStatsQuery.find().then(r2 => {
                        r2.set('curConfirmed', v1.currentConfirmedCount)
                        r2.set('cumuConfirmed', v1.confirmedCount)
                        r2.set('curSuspected', v1.suspectedCount)
                        r2.set('cumuCured', v1.curedCount)
                        r2.set('cumuDead', v1.deadCount)
                        r2.saveAll().then(r3 => {
                            console.log(r3)
                            console.log(province + ' done')
                        })
                    })
                })
            })
        }



    },


    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "M+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日

            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    },

    initProvinceDaily: () => {
        axios.get('http://111.231.75.86:8000/api/provinces/CHN')
            .then(res1 => {
                // var curConfirmed
                res1.data.forEach(v => {

                    axios.get('http://111.231.75.86:8000/api/provinces/CHN/' + v.provinceName + "/daily/")
                        .then(v2 => {
                            var dateId = [], curConfirmed = [], cumuConfirmed = [], curSuspected = [],
                                cumuCured = [], cumuDead = [],
                                cumuSuspectedIncr = [],
                                cumuDeadIncr = [],
                                cumuConfirmedIncr = [],
                                curConfirmedIncr = [],
                                cumuCuredIncr = []


                            // var 
                            v2.data.forEach(v3 => {
                                dateId.push(v3.dateId)
                                curConfirmed.push(v3.currentConfirmedCount)
                                cumuConfirmed.push(v3.confirmedCount)
                                curSuspected.push(v3.suspectedCount)
                                cumuCured.push(v3.curedCount)
                                cumuDead.push(v3.deadCount)

                                cumuSuspectedIncr.push(v3.suspectedCountIncr)
                                cumuDeadIncr.push(v3.deadIncr)
                                cumuConfirmedIncr.push(v3.confirmedIncr)
                                curConfirmedIncr.push(v3.currentConfirmedIncr)
                                cumuCuredIncr.push(v3.curedIncr)
                            })
                            var pdq = Bmob.Query('provice_daily')
                            pdq.set('name', v.provinceName)
                            pdq.add('dateId', dateId)
                            pdq.add('curConfirmed', curConfirmed)
                            pdq.add('cumuConfirmed', cumuConfirmed)
                            pdq.add('curSuspected', curSuspected)
                            pdq.add('cumuCured', cumuCured)
                            pdq.add('cumuDead', cumuDead)

                            var pdi = Bmob.Query('province_incr')
                            pdi.set('name', v.provinceName)
                            pdi.add('cumuSuspectedIncr', cumuSuspectedIncr)
                            pdi.add('cumuDeadIncr', cumuDeadIncr)
                            pdi.add('cumuConfirmedIncr', cumuConfirmedIncr)
                            pdi.add('curConfirmedIncr', curConfirmedIncr)
                            pdi.add('cumuCuredIncr', cumuCuredIncr)
                            pdi.add('dateId', dateId)


                            pdq.save()
                            pdi.save()
                            console.log('done')

                        })
                })
            })
    },

    initCountryDaily: () => {
        axios.get('http://111.231.75.86:8000/api/countries/daily/?countryNames=中国')
        .then(v2 => {
            var dateId = [], curConfirmed = [], cumuConfirmed = [], curSuspected = [],
                cumuCured = [], cumuDead = [],
                cumuSuspectedIncr = [],
                cumuDeadIncr = [],
                cumuConfirmedIncr = [],
                curConfirmedIncr = [],
                cumuCuredIncr = []


            // var 
            v2.data.forEach(v3 => {
                dateId.push(v3.dateId)
                curConfirmed.push(v3.currentConfirmedCount)
                cumuConfirmed.push(v3.confirmedCount)
                curSuspected.push(v3.suspectedCount)
                cumuCured.push(v3.curedCount)
                cumuDead.push(v3.deadCount)

                cumuSuspectedIncr.push(v3.suspectedCountIncr)
                cumuDeadIncr.push(v3.deadIncr)
                cumuConfirmedIncr.push(v3.confirmedIncr)
                curConfirmedIncr.push(v3.currentConfirmedIncr)
                cumuCuredIncr.push(v3.curedIncr)
            })
            countryDailyQuery.set('name', '中国')
            countryDailyQuery.add('dateId', dateId)
            countryDailyQuery.add('curConfirmed', curConfirmed)
            countryDailyQuery.add('cumuConfirmed', cumuConfirmed)
            countryDailyQuery.add('curSuspected', curSuspected)
            countryDailyQuery.add('cumuCured', cumuCured)
            countryDailyQuery.add('cumuDead', cumuDead)

            countryIncrQuery.set('name', '中国')
            countryIncrQuery.add('cumuSuspectedIncr', cumuSuspectedIncr)
            countryIncrQuery.add('cumuDeadIncr', cumuDeadIncr)
            countryIncrQuery.add('cumuConfirmedIncr', cumuConfirmedIncr)
            countryIncrQuery.add('curConfirmedIncr', curConfirmedIncr)
            countryIncrQuery.add('cumuCuredIncr', cumuCuredIncr)
            countryIncrQuery.add('dateId', dateId)


            countryDailyQuery.save()
            countryIncrQuery.save()
            console.log('done')

        })
    },

    // 更新国家或地区的累计数据
    // which：'country' or 'province'

    // 清理函数
    clearTableByUnit(query) {
        return new Promise(res => {
            query.limit(50)
            query.find().then(res2 => {
                res2.destroyAll().then(() => {
                    console.log('once succeed')
                })
                    .catch(() => {
                        console.log('end')
                    })
            })
            res('???')
        })
    },
    async clearTable(daily, incr, time) {
        var i, x, y
        for (i = 0; i < time; i++) {
            x = await multiTimesFuncs.clearTableByUnit(daily)
        }
        // console.log(rd)
        for (i = 0; i < time; i++) {
            y = await multiTimesFuncs.clearTableByUnit(incr)
        }
        console.log(x, y)
    },

    updateCountryOrProvinceDaily(which) {
        var q_incr, q_daily, timeout
        if (which === 'country') {
            q_daily = countryDailyQuery
            q_incr = countryIncrQuery
            timeout = 1000


        }
        else {
            q_daily = provinceDailyQuery
            q_incr = provinceIncrQuery
            timeout = 1500

        }
        q_daily.limit(1000)
        q_incr.limit(1000)
        q_daily.find().then((res) => {
            res.destroyAll().then().catch(err => { console.log('end' + err) })
        }).catch(err => { console.log(err + 'end') })
        q_incr.find().then((res) => {
            res.destroyAll().then().catch(err => { console.log('end' + err) })
        }).catch(err => { console.log(err + 'end') })

        setTimeout(() => {
            if (which == 'country') this.initCountryDaily()
            else this.initProvinceDaily()
            console.log(which+'done!')
        }, timeout)
    },


    updateCountryOrProvinceStats(which) {
        if (which === 'country') {
            countryList.forEach(v1 => {
                this.updateSpecific(which, v1)
            })

        }
        else {
            provinceList.forEach(v => {
                this.updateSpecific(which, v)
            })
        }

    },


    /*
    用于更新某个省/国家的数据，which同上，
    name为国家名或省名称简写(不是全称！),可以通过lib.provinceList/lib.countryList获得名称列表
    */
    updateSpecific(which, name) {
        var list, q, route
        if (which == 'country') {
            list = countryList
            q = Bmob.Query('country_stats')
            route = 'countries/?countryNames='
        }
        else if (which == 'province') {
            list = provinceList
            q = Bmob.Query('province_stats')
            route = 'provinces/CHN/?provinceName='
        }
        else return false
        console.log(list.length)
        // if (list.indexOf(name) == -1) {
        //     console.log('not found')
        //     return false
        // }
        console.log('http://111.231.75.86:8000/api/' + route  + name)
        axios.get('http://111.231.75.86:8000/api/' + route + name)
            .then(res1 => {
                q.equalTo('name', '==', name)
                q.find().then(res2 => {
                    console.log(res2)
                    res2.set('cumuConfirmed', res1.data[0].confirmedCount)
                    res2.set('cumuDead', res1.data[0].deadCount)
                    res2.set('cumuCured', res1.data[0].curedCount)
                    res2.set('curConfirmed', res1.data[0].currentConfirmedCount)
                    res2.set('curSuspected', res1.data[0].suspectedCount)


                    // 之后更新境外输入病例
                    if (which == 'province') {
                        axios.get('http://111.231.75.86:8000/api/cities/CHN/?provinceNames=' + name)
                            .then(res3 => {
                                // console.log(res3)
                                for (var i = 0; i < res3.data.length; i++) {
                                    if (res3.data[i].cityName.indexOf('境外') != -1) {
                                        res2.set('incomeNum', res3.data[i].confirmedCount + res3.data[i].suspectedCount)
                                        res2.set('curNonsymptom', 0)
                                        res2.saveAll()
                                        console.log(res3.data[i])
                                        console.log('update ' + name + ' done')
                                        break;
                                    }
                                    // 没有公布境外输入
                                    else if (i == res3.data.length - 1) {
                                        res2.set('incomeNum', 0)
                                        res2.set('curNonsymptom', 0)
                                        res2.saveAll()
                                        // console.log(res3.data[i])
                                        console.log('update ' + name + ' done')
                                    }
                                }
                            })
                    }
                    else {
                        if (name == '中国') {
                            console.log('here')
                            axios.get('http://111.231.75.86:8000/api/cities/CHN')
                                .then(res3 => {
                                    var total1 = 0
                                    res3.data.forEach(v1 => {
                                        if (v1.cityName.indexOf('境外') != -1 && provinceList.indexOf(v1.provinceName)!=-1) {
                                            total1 += v1.confirmedCount
                                            // total2 += v1.suspectedCount
                                        }
                                    })
                                    res2.set('incomeNum', total1)
                                    res2.set('curNonsymptom', 0)
                                    res2.saveAll()
                                    console.log('update ' + name + ' done')
                                })

                        }
                        else res2.saveAll()
                    }
                })
            }).catch(err=>{
                console.log('is here???',err)
            })



    },





}


export default {
    test: test,
    oneOffFuncs: oneOffFuncs,
    multiTimesFuncs: multiTimesFuncs,
}