<template>
  <v-flex class="simple-editor" xs12 style="height:100%;"  v-bind:class="{ hidden: !documentExists }">
    <v-flex class="editor-note" id="quill-editor" ref="editorNode" style="background-color:white"></v-flex>
  </v-flex>
</template>

<script>
import "quill/dist/quill.snow.css";
export default {
  props: {
    value: {
      default: "",
      type: String
    },
    edit: Boolean
  },
  computed: {
    editorContent: {
        get() {
            return this.$store.getters['quillJS/editorContent'];
        }, set(val) {
            return this.$store.dispatch['quillJS/setEditorContent'];
        }
    },
    documentExists() {
      return this.$store.getters['documents_v2/activeDocument'] != null;
    }   
  },
  watch: {
    value(newVal) {
      if (newVal !== this.editorContent) {
        this.editorInstance.pasteHTML(newVal);
      }
    }
  }
};
</script>

<style scoped>
.hideToolbar .ql-toolbar .ql-snow {
  display: none;
}
.hidden {
  display: none;
}

</style>