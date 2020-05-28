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
var data={
    //(216+34)*120 34*120 
}
// 定时刷新数据方法
var refresh=(interval)=>{
    console.log(interval)
}

var test = ()=>{
    console.log(countryQuery,provinceQuery,data,citiesStatsQuery,
        refresh,countryStatsQuery,provinceStatsQuery,countryIncrQuery,
        provinceIncrQuery,countryDailyQuery,provinceDailyQuery)



}


var oneOffFuncs={
    // 导入国家名称数据
    // 如果选择isLoadStats,则顺道将所有国家的疫情信息导入
    loadCountryNames:(isLoadStats)=>{
        
        axios.get('http://111.231.75.86:8000/api/countries')
        .then(r1=>{
            r1.data.forEach(v=>{
                // 如果选择isLoadStats,则顺道将所有国家的疫情信息导入
                if(isLoadStats) multiTimesFuncs.loadCountryStats(v.countryName);
                countryListQuery.set('continents',v.continents)
                countryListQuery.set('countryName',v.countryName)
                countryListQuery.save()
            })
        })
    },
    

    //导入中国的省份名称
    // 如果isLoadStats为真，则顺道导入所有的省份的统计数据
    loadProvinceNames:(isLoadStats)=>{
        axios.get('http://111.231.75.86:8000/api/provinces')
        .then(res => {
            // console.log(res)
            res.data.forEach(v=>{
                countryQuery.set('name','中国')
                countryQuery.set('province',v.provinceName)
                countryQuery.set('provinceShortName',v.provinceShortName)
                if(isLoadStats){
                    multiTimesFuncs.loadProvinceStats(v.provinceName)
                }
                return countryQuery.save()
            
            })
        })
    },

    // 导入所有省份下的城市名称信息
    // 如果isLoadStats为真，则顺道导入所有的城市的统计数据
    loadCityNames: (isLoadStats)=>{
        countryQuery.equalTo('name','==','中国')
        countryQuery.find().then(r1=>{
            console.log(r1)
            r1.forEach(v1=>{
                var url='http://111.231.75.86:8000/api/cities/?provinceName='+v1.province
                axios.get(url).then(r2=>{
                    console.log(r2)
                    r2.data.forEach(v2 => {
                        if(v2.cityName!='境外输入'&&v2.cityName!='外地来津'){
                            provinceQuery.set('name',v1.province)
                            provinceQuery.set('cityName',v2.cityName)
                            // 如果选择了isLoadStats,那么将顺道导入城市的疫情数据
                            if(isLoadStats)  multiTimesFuncs.loadCityStatsDetail(v2)
                            return provinceQuery.save()
                        }
                    });
                })
            })
        })
    },

    
    initCountryDaily:()=>{
        axios.get('http://111.231.75.86:8000/api/countries')
        .then(res1=>{
            // var curConfirmed
            res1.data.forEach(v=>{
                // multiTimesFuncs.loadProvinceStats(v.provinceShortName)
                 axios.get('http://111.231.75.86:8000/api/countries/'+v.countryName+"/daily/")
                .then(v2=>{
                    var dateId=[],curConfirmed=[],cumuConfirmed=[],curSuspected=[],
                    cumuCured=[],cumuDead=[],
                    cumuSuspectedIncr=[],
                    cumuDeadIncr=[],
                    cumuConfirmedIncr=[],
                    curConfirmedIncr=[],
                    cumuCuredIncr=[]


                    // var 
                    v2.data.forEach(v3=>{
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
                    countryDailyQuery.set('name',v.countryName)
                    countryDailyQuery.add('dateId',dateId)
                    countryDailyQuery.add('curConfirmed',curConfirmed)
                    countryDailyQuery.add('cumuConfirmed',cumuConfirmed)
                    countryDailyQuery.add('curSuspected',curSuspected)
                    countryDailyQuery.add('cumuCured',cumuCured)
                    countryDailyQuery.add('cumuDead',cumuDead)

                    countryIncrQuery.set('name',v.countryName)
                    countryIncrQuery.add('cumuSuspectedIncr',cumuSuspectedIncr)
                    countryIncrQuery.add('cumuDeadIncr',cumuDeadIncr)
                    countryIncrQuery.add('cumuConfirmedIncr',cumuConfirmedIncr)
                    countryIncrQuery.add('curConfirmedIncr',curConfirmedIncr)
                    countryIncrQuery.add('cumuCuredIncr',cumuCuredIncr)
                    countryIncrQuery.add('dateId',dateId)

                    
                    countryDailyQuery.save()
                    countryIncrQuery.save()
                    console.log('done')

                })
            })
        })
    },
    initProvinceDaily:()=>{
        axios.get('http://111.231.75.86:8000/api/provinces')
        .then(res1=>{
            // var curConfirmed
            res1.data.forEach(v=>{
                // multiTimesFuncs.loadProvinceStats(v.provinceShortName)
                 axios.get('http://111.231.75.86:8000/api/provinces/'+v.provinceShortName+"/daily/")
                .then(v2=>{
                    var dateId=[],curConfirmed=[],cumuConfirmed=[],curSuspected=[],
                    cumuCured=[],cumuDead=[],
                    cumuSuspectedIncr=[],
                    cumuDeadIncr=[],
                    cumuConfirmedIncr=[],
                    curConfirmedIncr=[],
                    cumuCuredIncr=[]


                    // var 
                    v2.data.forEach(v3=>{
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
                    provinceDailyQuery.set('name',v.provinceShortName)
                    provinceDailyQuery.add('dateId',dateId)
                    provinceDailyQuery.add('curConfirmed',curConfirmed)
                    provinceDailyQuery.add('cumuConfirmed',cumuConfirmed)
                    provinceDailyQuery.add('curSuspected',curSuspected)
                    provinceDailyQuery.add('cumuCured',cumuCured)
                    provinceDailyQuery.add('cumuDead',cumuDead)
                    
                    provinceIncrQuery.set('name',v.provinceShortName)
                    provinceIncrQuery.add('cumuSuspectedIncr',cumuSuspectedIncr)
                    provinceIncrQuery.add('cumuDeadIncr',cumuDeadIncr)
                    provinceIncrQuery.add('cumuConfirmedIncr',cumuConfirmedIncr)
                    provinceIncrQuery.add('curConfirmedIncr',curConfirmedIncr)
                    provinceIncrQuery.add('cumuCuredIncr',cumuCuredIncr)
                    provinceIncrQuery.add('dateId',dateId)

                    
                    provinceDailyQuery.save()
                    provinceIncrQuery.save()
                    console.log('done')

                })
            })
        })
    },


}

var multiTimesFuncs = {






    loadCityStatsDetail:(cityStats)=>{
    // 通过城市数据集导入城市数据
        citiesStatsQuery.set('name',cityStats.cityName)
        citiesStatsQuery.set('cumuConfirmed',cityStats.confirmedCount)
        citiesStatsQuery.set('cumuDead',cityStats.deadCount)
        citiesStatsQuery.set('cumuCured',cityStats.curedCount)
        citiesStatsQuery.set('curSuspected',cityStats.suspectedCount)
        citiesStatsQuery.set('curConfirmed',cityStats.currentConfirmedCount)
        return citiesStatsQuery.save()
    }

}


export default{
    test:test,
    oneOffFuncs:oneOffFuncs,
    multiTimesFuncs:multiTimesFuncs,
}