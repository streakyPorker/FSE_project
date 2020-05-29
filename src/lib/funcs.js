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

var recordQuery = Bmob.Query('record_day')
var record_Id = Bmob.Query('record_day').get('WI8sKKKL').dateId



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
        record_Id, recordQuery)



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
                    countryQuery.set('provinceShortName', v.provinceShortName)
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


    initCountryDaily: () => {
        axios.get('http://111.231.75.86:8000/api/countries')
            .then(res1 => {
                // var curConfirmed
                res1.data.forEach(v => {
                    // multiTimesFuncs.loadProvinceStats(v.provinceShortName)
                    axios.get('http://111.231.75.86:8000/api/countries/' + v.countryName + "/daily/")
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
                            countryDailyQuery.set('name', v.countryName)
                            countryDailyQuery.add('dateId', dateId)
                            countryDailyQuery.add('curConfirmed', curConfirmed)
                            countryDailyQuery.add('cumuConfirmed', cumuConfirmed)
                            countryDailyQuery.add('curSuspected', curSuspected)
                            countryDailyQuery.add('cumuCured', cumuCured)
                            countryDailyQuery.add('cumuDead', cumuDead)

                            countryIncrQuery.set('name', v.countryName)
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
                })
            })
    },
    initProvinceDaily: () => {
        axios.get('http://111.231.75.86:8000/api/provinces')
            .then(res1 => {
                // var curConfirmed
                res1.data.forEach(v => {
                    // multiTimesFuncs.loadProvinceStats(v.provinceShortName)
                    axios.get('http://111.231.75.86:8000/api/provinces/' + v.provinceShortName + "/daily/")
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
                            provinceDailyQuery.set('name', v.provinceShortName)
                            provinceDailyQuery.add('dateId', dateId)
                            provinceDailyQuery.add('curConfirmed', curConfirmed)
                            provinceDailyQuery.add('cumuConfirmed', cumuConfirmed)
                            provinceDailyQuery.add('curSuspected', curSuspected)
                            provinceDailyQuery.add('cumuCured', cumuCured)
                            provinceDailyQuery.add('cumuDead', cumuDead)

                            provinceIncrQuery.set('name', v.provinceShortName)
                            provinceIncrQuery.add('cumuSuspectedIncr', cumuSuspectedIncr)
                            provinceIncrQuery.add('cumuDeadIncr', cumuDeadIncr)
                            provinceIncrQuery.add('cumuConfirmedIncr', cumuConfirmedIncr)
                            provinceIncrQuery.add('curConfirmedIncr', curConfirmedIncr)
                            provinceIncrQuery.add('cumuCuredIncr', cumuCuredIncr)
                            provinceIncrQuery.add('dateId', dateId)


                            provinceDailyQuery.save()
                            provinceIncrQuery.save()
                            console.log('done')

                        })
                })
            })
    },


}

var multiTimesFuncs = {

    loadStats(which) {
        var q, route
        if (which === 'country') {
            q = countryStatsQuery
            route = 'countries'
        }
        else {
            q = provinceStatsQuery
            route = 'provinces'
        }
        axios.get('http://111.231.75.86:8000/api/' + route)
            .then(res1 => {
                res1.data.forEach(v1 => {
                    if (which === 'country') {
                        q.set('name', v1.countryName)
                    }
                    else {
                        q.set('name', v1.provinceShortName)
                    }
                    q.set('cumuConfirmed', v1.confirmedCount)
                    q.set('cumuDead', v1.deadCount)
                    q.set('cumuCured', v1.curedCount)
                    q.set('curConfirmed', v1.currentConfirmedCount)
                    q.set('curSuspected', v1.suspectedCount)
                    q.save()

                    if (which === 'country') {
                        // q.set('name',v1.countryName)
                        console.log('load ' + v1.countryName + ' done')
                    }
                    else {
                        // q.set('name',v1.provinceShortName)
                        console.log('load ' + v1.provinceShortName + ' done')

                    }

                })



            })


    },


    loadCityStats: (cityStats) => {
        // 通过城市数据集导入城市数据
        citiesStatsQuery.set('name', cityStats.cityName)
        citiesStatsQuery.set('cumuConfirmed', cityStats.confirmedCount)
        citiesStatsQuery.set('cumuDead', cityStats.deadCount)
        citiesStatsQuery.set('cumuCured', cityStats.curedCount)
        citiesStatsQuery.set('curSuspected', cityStats.suspectedCount)
        citiesStatsQuery.set('curConfirmed', cityStats.currentConfirmedCount)
        return cityStats
    },

    /*
    name
    cumuConfirmed
    cumuDead
    cumuCured
    incomeNum
    curConfirmed
    curNonsymptom
    curSuspected
    */

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



    // 更新国家或地区的累计数据
    // which：'country' or 'province'
    // today: dateId format,generated by  dateFormat(fmt, date)

    // 存在问题：country带宽过大
    updateCountryOrProvinceDaily(which, today) {
        var q_incr, q_daily, route
        if (which === 'country') {
            q_incr = countryIncrQuery
            q_daily = countryDailyQuery
            route = 'countries'
            // req = countryListQuery.find()
        }
        else {
            q_incr = provinceIncrQuery
            q_daily = provinceDailyQuery
            route = 'provinces'
        }
        q_daily.find().then(res1 => {
            // 所有国家和地区
            for (var i = res1.length - 1; i >= 0; i--) {
                var v1 = res1[i]
                console.log(i, res1[i].name)
                var maxId = v1.dateId[v1.dateId.length - 1]
                axios.get('http://111.231.75.86:8000/api/' + route + '/' + v1.name + "/daily")
                    .then(res2 => {

                        // console.log(res2.data[res2.data.length-1])
                        // 可被加入的信息
                        var newData = []
                        // var newData = res2.data.filter(v2=>{
                        //     return eval(v2.dateId)>eval(maxId)&&
                        //     eval(v2.dateId)<=eval(today)
                        // })
                        for (var i = res2.data.length - 1; i >= 0; i--) {
                            if (eval(res2.data[i].dateId) > eval(maxId) &&
                                eval(res2.data[i].dateId) <= eval(today))
                                newData.push(res2.data[i])
                            else break;
                        }

                        if (newData.length == 0) {
                            console.log('no new data')
                        }
                        else {
                            console.log(newData.length, q_incr)
                            // console.log(newData[0])
                            // duime
                            newData.forEach(v2 => {
                                q_daily.get(v1.objectId).then(res3 => {
                                    res3.add('dateId', v2.dateId)
                                    res3.add('curConfirmed', v2.currentConfirmedCount)
                                    res3.add('cumuConfirmed', v2.confirmedCount)
                                    res3.add('curSuspected', v2.suspectedCount)
                                    res3.add('cumuCured', v2.curedCount)
                                    res3.add('cumuDead', v2.deadCount)
                                    res3.save()
                                })

                                q_incr.equalTo('name', '==', v1.name)
                                q_incr.find().then(res3 => {
                                    var rst = res3[0]
                                    rst.add('dateId', v2.dateId)
                                    rst.add('cumuSuspectedIncr', v2.suspectedCountIncr)
                                    rst.add('cumuDeadIncr', v2.deadIncr)
                                    rst.add('cumuConfirmedIncr', v2.confirmedIncr)
                                    rst.add('curConfirmedIncr', v2.currentConfirmedIncr)
                                    rst.add('cumuCuredIncr', v2.curedIncr)
                                    res3.save()
                                })


                            })
                            q_daily.save()
                            q_incr.save()
                            console.log('upload ' + v1.name + ' done.')

                        }
                    })
            }
        })
    },

    updateCountryOrProvinceStats(which) {
        var q, route
        if (which === 'country') {
            q = countryStatsQuery
            route = 'countries'
        }
        else {
            q = provinceStatsQuery
            route = 'provinces'
        }
        axios.get('http://111.231.75.86:8000/api/' + route)
            .then(res1 => {
                res1.data.forEach(v1 => {
                    if (which === 'country') {
                        q.equalTo('name','==', v1.countryName)
                    }
                    else {
                        q.equalTo('name','==', v1.provinceShortName)
                    }
                    q.find().then(res2=>{
                        console.log(res2)
                        // var rst = q.get(res2.objectId)
                        res2.set('cumuConfirmed', v1.confirmedCount)
                        res2.set('cumuDead', v1.deadCount)
                        res2.set('cumuCured', v1.curedCount)
                        res2.set('curConfirmed', v1.currentConfirmedCount)
                        res2.set('curSuspected', v1.suspectedCount)
                        res2.saveAll()
                        if (which === 'country') {
                            // q.set('name',v1.countryName)
                            console.log('update ' + v1.countryName + ' done')
                        }
                        else {
                            // q.set('name',v1.provinceShortName)
                            console.log('update ' + v1.provinceShortName + ' done')
                        }

                    })
                    



                })



            })
    },





}


export default {
    test: test,
    oneOffFuncs: oneOffFuncs,
    multiTimesFuncs: multiTimesFuncs,
}