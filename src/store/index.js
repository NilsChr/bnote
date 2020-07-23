import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import drawer from './modules/drawer'
import userFeedback from './modules/userFeedback'
import documents from './modules/documents'
import quillJS from './modules/quillJS'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        user,
        drawer,
        userFeedback,
        documents,
        quillJS
    }
})