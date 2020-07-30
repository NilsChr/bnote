import Quill from "quill";
import { db } from "../../db";

import ImageCompress from 'quill-image-compress';

window.hljs.configure({
  // optionally configure hljs
  // languages: ['javascript', 'ruby', 'python']
});

const state = {
  editorContent: null,
  editorInstance: null,
  editorOpts: {
    bounds: '#quill-editor',

    modules: {
      syntax: true,
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
        ["link", "image", "video"],
        [{ direction: "rtl" }],
      ],
      keyboard: {
        bindings: {
          "indent code-block": null,
          "outdent code-block": null,
        },
      },
      imageCompress: {
        quality: 0.7, // default
        maxWidth: 1000, // default
        maxHeight: 1000, // default
        imageType: 'image/jpeg/png', // default
        debug: false, // default
      }
    },
    theme: "snow",
  },
  canEdit: false,
};

const getters = {
  editorContent: (state) => state.editorContent,
  canEdit: (state) => state.canEdit,

  search_topic: (state) => state.search_topic,
};

const mutations = {
  setEditorContent: (state, editorContent) => {
    state.editorContent = editorContent;
  },
  setCanEdit: (state, canEdit) => {
    state.canEdit = canEdit;
  },
};

const actions = {
  initEditor: ({ commit }, payload) => {
    const initializeEditor = function() {
        Quill.register('modules/imageCompress', ImageCompress);

      state.editorInstance = new Quill("#quill-editor", state.editorOpts);
      //state.editorInstance.on("text-change", onEditorContentChange);
      state.editorInstance.on("editor-change", onEditorContentChange);
      //state.editorInstance.on("selection-change", onEditorContentChange);

      setEditorContent();
      if (payload) state.editorInstance.root.innerHTML = payload;

      if (!state.canEdit) {
        let qel = document.getElementsByClassName("ql-toolbar")[0];
        qel.style.display = "none";
        state.editorInstance.enable(false);
      }
    };

    const onEditorContentChange = function() {
      setEditorContent();
      db.updateDocumentData(state.editorContent);
    };

    const setEditorContent = function() {
      /*state.editorContent = state.editorInstance.getText().trim()
        ? state.editorInstance.root.innerHTML
        : "";*/
      state.editorContent = state.editorInstance.root.innerHTML;
    };

    initializeEditor();
  },
  closeEditor: ({ commit }) => {
    state.editorInstance.off("text-change");
  },
  setEditorContent: ({ commit }, payload) => {
    commit("setEditorContent", payload);
  },
  disableEditor: ({ commit }, payload) => {
    if (!state.editorInstance) return;
    state.editorInstance.enable(payload);

    let qel = document.getElementsByClassName("ql-toolbar")[0];
    if (!qel) return;

    if (payload) {
      qel.style.display = "block";
    } else qel.style.display = "none";
  },
  setCanEdit: ({ commit }, payload) => {
    commit("setCanEdit", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
