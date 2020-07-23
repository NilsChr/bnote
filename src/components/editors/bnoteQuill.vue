<template>
  <v-flex class="simple-editor" xs12 style="height:100%;" >
    <v-flex class="editor-note" id="quill-editor" ref="editorNode" style="background-color:white" ></v-flex>
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
    }   
  },
  watch: {
    value(newVal) {
      // Only update the content if it's changed from an external source
      // or else it'll act weird when you try to type anything
      if (newVal !== this.editorContent) {
        this.editorInstance.pasteHTML(newVal);
      }
    }
  },
  beforeDestroy() {
    // Turn off all listeners set on text-change
    //this.editorInstance.off("text-change");
  }
};
</script>

<style scoped>
.hideToolbar .ql-toolbar .ql-snow {
  display: none;
}
</style>