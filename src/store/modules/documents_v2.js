import { mongoService } from "../../db/mongoService";
import Vue from "vue";
import { store } from "../index";

const state = {
  loadingDocuments: false,
  documents: [],
  activeDocumentID: null,
  activeDocument: null,
  maxDocumentSize: 1048487,
  currentDocumentSize: 0,
};

const getters = {
  loadingDocuments: (state) => state.loadingDocuments,
  documents: (state) => state.documents,
  activeDocumentID: (state) => state.activeDocumentID,
  /*activeDocument: (state) =>
    state.documents.filter((d) => d._id == state.activeDocumentID)[0],*/
  activeDocument: (state) => state.activeDocument,

  maxDocumentSize: (state) => state.maxDocumentSize,
  currentDocumentSize: (state) => state.currentDocumentSize,
};

const mutations = {
  setLoadingDocuments: (state, loadingDocuments) => {
    state.loadingDocuments = loadingDocuments;
  },
  setDocuments: (state, documents) => {
    state.documents = documents;
  },
  setActiveDocumentID: (state, activeDocumentID) => {
    state.activeDocumentID = activeDocumentID;
  },
  setActiveDocument: (state, activeDocument) => {
    state.activeDocument = activeDocument;
  },
  setCurrentDocumentSize: (state, currentDocumentSize) => {
    state.currentDocumentSize = currentDocumentSize;
  },
};

const actions = {
  setSelectedDocument: ({ commit, state }, document) => {
    commit("setActiveDocumentID", document._id);
    let doc = state.documents.filter((d) => d._id == document._id)[0];
    commit("setActiveDocument", document);
    console.log('SET SELECT', document)
    Vue.nextTick(function() {
      store.dispatch("quillJS/initEditor", document.data);
    });
  },
  setActiveDocument: ({ commit, state }, doc) => {
    if (!doc) {
      commit("setActiveDocumentID", null);
    } else commit("setActiveDocumentID", doc._id);

    commit("setActiveDocument", doc);
  },
  loadDocuments: async ({ commit }) => {
    console.log('LOADING');
    commit("setLoadingDocuments", true);
    let documents = await mongoService.getDocuments();
    //if(!documents) return;
    console.log('DOCUMENTS: ', documents);
    commit("setDocuments", documents.data);
    commit("setLoadingDocuments", false);
  },
  createNewDocument: async ({ commit }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let newDoc = await mongoService.createDocument();
        resolve(newDoc);
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  },
  deleteSelectedDocument: async ({ commit, dispatch, state }) => {
    return new Promise(async (resolve, reject) => {
      commit("setLoadingDocuments", true);
      try {
        await mongoService.deleteDocument(state.activeDocumentID);
        commit("setLoadingDocuments", false);
        dispatch("loadDocuments");
        resolve();
      } catch (e) {
        commit("setLoadingDocuments", false);
        dispatch("loadDocuments");
        reject(e);
      }
    });
  },
  updateDocumentTitle: async ({ commit, dispatch, state }, title) => {
    let doc = state.documents.filter((d) => d._id == state.activeDocumentID)[0];
    doc.title = title;
    mongoService.updateDocument();
    dispatch("reloadDocuments");
  },
  updateDocumentTopics: async ({ commit, dispatch, state }, topics) => {
    let doc = state.documents.filter((d) => d._id == state.activeDocumentID)[0];
    doc.topics = topics;
    mongoService.updateDocument();
    dispatch("reloadDocuments");
  },
  updateDocument: async ({ commit, state }, document) => {
    let newDocs = JSON.parse(JSON.stringify(state.documents));
    for (let i = 0; i < newDocs.length; i++) {
      if (newDocs[i]._id == document._id) {
        newDocs[i] = document;
      }
    }
    commit("setDocuments", newDocs);
  },
  updateLocalDocument: async ({ commit, state }, document) => {
    for (let i = 0; i < state.documents.length; i++) {
      if (state.documents[i]._id == document._id) {
        state.documents[i] = document;
      }
    }
    commit("setDocuments", state.documents);
  },
  reloadDocuments: async ({ commit, state }, document) => {
    commit("setDocuments", state.documents);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
