import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import drawer from './modules/drawer'
import userFeedback from './modules/userFeedback'
import documents from './modules/documents'
import documents_v2 from './modules/documents_v2'

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
        documents_v2,
        quillJS
    }
})