import { db } from "../../db"
import {store} from '../index';
import Vue from 'vue'

const state = {
    documents: [],
    selectedDocumentMeta: null,
    selectedDocumentData: null,
    loadingDocument: false
}

const getters = {
    documents: state => state.documents,
    selectedDocumentMeta: state => state.selectedDocumentMeta,
    selectedDocumentData: state => state.selectedDocumentData,
    loadingDocument: state => state.loadingDocument
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
            //store.dispatch("editorJS/initEditor");
            /*setTimeout(() => {
                store.dispatch("quillJS/initEditor");

            },100);*/
            Vue.nextTick(function () {
                // do something cool
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}