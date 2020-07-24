import Quill from "quill";
import { db } from "../../db";


window.hljs.configure({
  // optionally configure hljs
  // languages: ['javascript', 'ruby', 'python']
});

const state = {
  editorContent: null,
  editorInstance: null,
  editorOpts: {
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
      state.editorInstance = new Quill("#quill-editor", state.editorOpts);
      state.editorInstance.on("text-change", onEditorContentChange);
      setEditorContent();
      if (payload) state.editorInstance.root.innerHTML = payload.data;

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
      state.editorContent = state.editorInstance.getText().trim()
        ? state.editorInstance.root.innerHTML
        : "";
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
