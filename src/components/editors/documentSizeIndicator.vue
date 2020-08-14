<template>
  <v-flex xs12 v-if="canEdit">
      <label v-if="documentSize >= 100" id="document_too_large">Document too large!</label>
    <v-progress-linear :color="getColor()" height="2" :value="documentSize"></v-progress-linear>
  </v-flex>
</template>

<script>
export default {
  methods: {
      getColor() {
          
        if(this.documentSize < 75) return 'secondary';
        if(this.documentSize >= 75 && this.documentSize < 100) return 'warning';
        return 'error';
      }
  },
  computed: {
    canEdit: {
      get() {
        return this.$store.getters["quillJS/canEdit"];
      },
      set(val) {
        this.$store.dispatch("quillJS/setCanEdit", val);
      }
    },
    documentSize() {
      //let max = this.$store.getters["documents/maxDocumentSize"];
      //let current = this.$store.getters["documents/currentDocumentSize"];
      let max = this.$store.getters["documents_v2/maxDocumentSize"];
      let current = this.$store.getters["documents_v2/currentDocumentSize"];
      return (current / max) * 100;
    }
  }
};
</script>

<style scoped>

#document_too_large {
    color:#b71c1c !important;
    text-align: center !important;
    display: block;
    text-align: center;
    font-size: 13px;
}

</style>