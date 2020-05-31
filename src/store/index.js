
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {

        hasLogin: false,
        curUser: '',
        meetups: [],
        totalNum: 0,
        users:[],

    },
    mutations: {
        

    },
    actions: {},
    getters: {},
        
})