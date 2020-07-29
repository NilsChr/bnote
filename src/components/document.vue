<template>
  <v-container fluid class="pt-0 pb-0" fill-height>
    <v-layout v-if="loadingDocument" justify-center align-center>
      <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
    </v-layout>
    <v-layout v-if="!loadingDocument" justify-space-around wrap align-start>
      <v-flex xs3 class="pa-2">
        <v-text-field label="Title" v-model="documentTitle" :disabled="!canEdit"></v-text-field>
      </v-flex>
      <v-flex xs3 class="pa-2">
        <v-text-field label="Topic" v-model="documentTopic" :disabled="!canEdit"></v-text-field>
      </v-flex>
      <v-flex xs6 class="pa-2">
        <v-layout justify-end>
          <buttonDeleteDocument />
          <buttonToggleEdit />
        </v-layout>
      </v-flex>

      <documentSizeIndicator />

      <!-- QUILL EDITOR -->
      <bnote-quill :edit="canEdit" />
    </v-layout>
  </v-container>
</template>

<script>
import bnoteQuill from "@/components/editors/bnoteQuill";
import buttonDeleteDocument from "@/components/buttons/buttonDeleteDocument";
import buttonToggleEdit from "@/components/buttons/buttonToggleEdit";
import buttonShareDocument from "@/components/buttons/buttonShareDocument";
import documentSizeIndicator from "@/components/editors/documentSizeIndicator";

export default {
  components: {
    bnoteQuill,
    buttonDeleteDocument,
    buttonToggleEdit,
    buttonShareDocument,
    documentSizeIndicator
  },
  data: () => ({
    deleteModal: false,
    value: null
  }),
  methods: {
    editColor() {
      return this.canEdit ? "warning" : "grey";
    },
    deleteDocument(willDelete) {
      this.deleteModal = false;
      if (willDelete) {
        this.$store.dispatch("documents/deleteSelectedDocument").then(() => {
          this.$store.dispatch("userFeedback/setText", {
            text: "Document succesfully deleted",
            color: "success"
          });
        });
      }
    },
    toggleEdit() {
      this.canEdit = !this.canEdit;
      this.$store.dispatch("quillJS/disableEditor", this.canEdit);
    }
  },
  computed: {
    loadingDocument() {
      return this.$store.getters["documents/loadingDocument"];
    },
    documentTitle: {
      get() {
        if (!this.$store.getters["documents/selectedDocumentMeta"]) return "";
        return this.$store.getters["documents/selectedDocumentMeta"].data.title;
      },
      set(val) {
        this.$store.dispatch("documents/updateDocumentTitle", val);
      }
    },
    documentTopic: {
      get() {
        if (!this.$store.getters["documents/selectedDocumentMeta"]) return "";
        return this.$store.getters["documents/selectedDocumentMeta"].data.topic;
      },
      set(val) {
        this.$store.dispatch("documents/updateDocumentTopic", val);
      }
    },
    canEdit: {
      get() {
        return this.$store.getters["quillJS/canEdit"];
      },
      set(val) {
        this.$store.dispatch("quillJS/setCanEdit", val);
      }
    },
    documentSize() {
      let max = this.$store.getters["documents/maxDocumentSize"];
      let current = this.$store.getters["documents/currentDocumentSize"];
      return (current / max) * 100;
    }
  },
  mounted() {}
};
</script>

<style>
</style>