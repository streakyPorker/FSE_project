/*

### 使用说明

1. 在腾讯云新建云函数，环境`Nodejs 8.9`。
2. 添加函数代码`getDxyData.js`、`index.js`，保存。
3. 添加触发方式`API网关触发器`，保存。
4. 获得访问路径。

*/

const request = require('request')

//获取丁香园疫情数据
async function getDxyData() {
  try {
    const body = await new Promise(
      (resolve, reject) => {
        request({
          method: 'GET',
          uri: 'https://ncov.dxy.cn/ncovh5/view/pneumonia'
        }, (error, response, body) => {
          if (error) return reject(error)
          resolve(body)
        })
      }
    )

    const statistics = JSON.parse(/getStatisticsService\s*=\s*(.*?)}catch/.exec(body)[1])
    const timeline = JSON.parse(/getTimelineService\s*=\s*(.*?)}catch/.exec(body)[1])

    const areaStatistics = JSON.parse(/getAreaStat\s*=\s*(.*?)}catch/.exec(body)[1])
    let listByArea = areaStatistics.map((x) => {
      return {
        provinceName: x.provinceName,
        provinceShortName: x.provinceShortName,
        tags: x.tags,
        confirmed: x.confirmedCount,
        suspected: x.suspectedCount,
        cured: x.curedCount,
        dead: x.deadCount,
        comment: x.comment,
        cities: x.cities.map((x) => {
          return {
            cityName: x.cityName,
            confirmed: x.confirmedCount,
            suspected: x.suspectedCount,
            cured: x.curedCount,
            dead: x.deadCount
          }
        })
      }
    })

    let listByOther = JSON.parse(/getListByCountryTypeService1\s*=\s*(.*?)}catch/.exec(body)[1])
    listByOther = listByOther.map((x) => {
      return {
        provinceId: x.provinceId,
        provinceName: x.provinceName,
        provinceShortName: x.provinceShortName,
        tags: x.tags,
        confirmed: x.confirmedCount,
        suspected: x.suspectedCount,
        cured: x.curedCount,
        dead: x.deadCount,
        comment: x.comment,
        createTime: x.createTime,
        modifyTime: x.modifyTime,
      }
    })

    return {
      readme: {
        source: 'https://ncov.dxy.cn/ncovh5/view/pneumonia',
        statistics: '数据概要',
        listByArea: '国内数据',
        listByOther: '国外数据',
        timeline: '实时播报'
      },
      statistics,
      listByArea,
      listByOther,
      timeline
    }
  } catch (err) {
    return null
  }
}

export const asd= {
    func:getDxyData
 }