import { db } from "../../db"

const state = {
    visible: false,
    text: '',
    timeout: 2000,
    color: ''
}

const getters = {
    visible: state => state.visible,
    text: state => state.text,
    timeout: state => state.timeout,
    color: state => state.color

}

const mutations = {
    setVisible: (state, visible) => {
        state.visible = visible
    },
    setText: (state, text) => {
        state.text = text
    },
    setColor: (state, color) => {
        state.color = color;
    }
}

const actions = {
    setVisible: ({ commit }, b) => {
      commit('setVisible', b)
    },
    setText: ({ commit }, data) => {
        commit('setText', data.text)
        commit('setColor', data.color)
        commit('setVisible', true)
        setTimeout(() => {
            commit('setVisible', false)
        }, state.timeout);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}