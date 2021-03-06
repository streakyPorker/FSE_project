
import Vue from 'vue'
import Vuex from 'vuex'
import Bmob from 'hydrogen-js-sdk'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {

        provinceList : ["上海", "云南", "内蒙古", "北京", "台湾", "吉林", "四川", "天津", "宁夏",
    "安徽", "山东", "山西", "广东", "广西", "新疆", "江苏", "江西", "河北", "河南", "浙江", "海南",
    "湖北", "湖南", "澳门", "甘肃", "福建", "西藏", "贵州", "辽宁", "重庆", "陕西", "青海", "香港",
    "黑龙江"],

        countryList : ["阿富汗", "阿联酋", "亚美尼亚", "阿塞拜疆", "孟加拉国", "巴林", "文莱", "不丹", "中国", "塞浦路斯", "格鲁吉亚",
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
    "突尼斯", "坦桑尼亚", "乌干达", "南非", "赞比亚共和国", "津巴布韦"],


        hasLogin: false,
        curUser: '',
        curRole:'guest',
        curRealm:'None',

        reqlog:false,

        standard:['guest','visitor','prov_admin','super_admin'],
        links: [
          { icon: "fa-home", text: "主页", route: "/" ,need:'guest'},
          { icon: "fa-map-marker", text: "疫情地图", route: "/Charts" ,need:'visitor'},
          { icon: "fa-cog", text: "信息管理与发布", route: "/Dispatch" ,need:'prov_admin'},
          { icon: "fa-user-plus", text: "超级管理员管理", route: "/Super" ,need:'super_admin'}
        ],

        dispatchOps:[
            {text:'全国自动发布',role:'super_admin',path:'/globalauto'},
            {text:'省内自动发布',role:'prov_admin',path:'/auto'},
        ],
        


    },
    mutations: {
        login(state,info){
            state.hasLogin=true
            // console.log(info)
            state.curUser = info.username
            state.curRole = info.role
            state.curRealm = info.realm
        },
        logout(state){
            state.hasLogin=false
            state.curUser = ''
            state.curRole = 'guest'
            state.curRealm = 'None'
        },
        dereq(state){
            state.reqlog = !state.reqlog
        },
        

    },
    actions: {},
    getters: {
        hasLogin(state){
            return state.hasLogin
        },
        reqlog(state){
            return state.reqlog
        },
        getFilteredLinks(state){
            return state.links.filter(v=>{
                return state.standard.indexOf(state.curRole)>=state.standard.indexOf(v.need)
   
            })
            // return state.links
        },
        getUserInfo(state){
            return {
                username:state.curUser,
                role:state.curRole,
                realm:state.curRealm
            }
        },

        getRoleGrade(state){
            return state.standard.indexOf(state.curRole)
        },

        // 发布相关getter
        getFilteredDispatchOps(state){
            return state.dispatchOps.filter(v=>{
                return v.role==state.curRole
            })
        },

        getProvinces(state){
            return state.provinceList
        },
        getCountries(state){
            return state.countryList
        },
        getCities(state){
            var q = Bmob.Query('cities_stats')
            q.equalTo('provinceName','==',state.curRealm)
            q.find().then(res=>{
                var cities = []
                res.forEach(v=>{
                    cities.push(v.name)
                })
                console.log(cities)
                return cities
            })
        }

    },
        
})