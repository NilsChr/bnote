import { db } from "../../db"
import {store} from '../index';
import Vue from 'vue'
import { mongoService } from "../../db/mongoService";

const state = {
    documents: [],
    selectedDocumentMeta: null,
    selectedDocumentData: null,
    loadingDocument: false,
    maxDocumentSize: 1048487,
    currentDocumentSize: 0
}

const getters = {
    documents: state => state.documents,
    selectedDocumentMeta: state => state.selectedDocumentMeta,
    selectedDocumentData: state => state.selectedDocumentData,
    loadingDocument: state => state.loadingDocument,
    maxDocumentSize: state => state.maxDocumentSize,
    currentDocumentSize: state => state.currentDocumentSize
}

const mutations = {
    setDocuments: (state, documents) => {
        state.documents = documents
    },
    setSelectedDocumentMeta: (state, document) => {
        state.selectedDocumentMeta = document
    },
    setSelectedDocumentData: (state, data) => {
        state.selectedDocumentData = data
    },
    setLoadingDocument: (state, loadingDocument) => {
        state.loadingDocument = loadingDocument;
    },
    setCurrentDocumentSize: (state, currentDocumentSize) => {
        state.currentDocumentSize = currentDocumentSize;
    }
}

const actions = {
    setDocuments: ({ commit }, documents) => {
      commit('setDocuments', documents)
    },
    setSelectedDocument: ({ commit }, document) => {
        commit('setLoadingDocument', true);
        commit('setSelectedDocumentMeta', document);
        db.loadDocumentData(document.data.data).then((data) => {
            commit('setLoadingDocument', false);
            commit('setSelectedDocumentData', data);

            Vue.nextTick(function () {
                store.dispatch("quillJS/initEditor", data);
            })
        })
    },
    deleteSelectedDocument: ({ commit }) => {
        return new Promise((resolve, reject) => {
            try {
                if(!state.selectedDocumentMeta) {
                    resolve();
                    return;
                } 
                commit('setLoadingDocument', true);
                db.deleteDocument(state.selectedDocumentMeta).then(() => {
                    commit('setLoadingDocument', false);
                    commit('setSelectedDocumentMeta', null);
                    commit('setSelectedDocumentData', null);
                })
                resolve();
            } catch(e) {
                reject(e);
            }
        })
    },
    updateDocumentTitle: ({commit}, title) => {
        if(!state.selectedDocumentMeta) return;
        state.selectedDocumentMeta.data.title = title;
        db.updateDocument(state.selectedDocumentMeta);
    },
    updateDocumentTopic: ({commit}, topic) => {
        if(!state.selectedDocumentMeta) return;
        state.selectedDocumentMeta.data.topic = topic;
        db.updateDocument(state.selectedDocumentMeta);
    },
    createNewDocument: ({commit}, data) => {
        return new Promise((resolve, reject) => {
            try {
                //mongoService.createDocument();
                db.createNewDocument().then((data) => {
                    resolve(data);
                    store.dispatch('quillJS/setCanEdit', true);
                });
            } catch(e) { reject(e)}
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}