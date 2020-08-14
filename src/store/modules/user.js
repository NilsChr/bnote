import auth from '@/auth';
import { mongoService } from '../../db/mongoService';

const state = {
    user: null,
    mongoUser: null
}

const getters = {
    user: state => state.user,
    isLogged: state => (state.user !== null),
    mongoUser: state => state.mongoUser
}

const mutations = {
    setUser: (state, user) => {
        state.user = user
    },
    setMongoUser: (state,user) => {
        state.mongoUser = user;
    }
}

const actions = {
    setCurrentUser: ({ commit }, user) => {
        commit('setUser', user)
      //commit('setUser', auth.user())
    },
    /*loadProfile: async ({commit}) => {
        let profile = await mongoService.getProfile();
        commit('setMongoUser', profile);
    }*/
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}