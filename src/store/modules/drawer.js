import { db } from "../../db"

const state = {
    search_title: '',
    search_topic: '',
}

const getters = {
    search_title: state => state.search_title,
    search_topic: state => state.search_topic
}

const mutations = {
    setSearchTitle: (state, title) => {
        state.search_title = title
    },
    setSearchTopic: (state, topic) => {
        state.search_topic = topic
    }
}

const actions = {
    setSearchTitle: ({ commit }, title) => {
      commit('setSearchTitle', title)
    },
    setSearchTopic: ({ commit }, topic) => {
        commit('setSearchTopic', topic)
    },

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}