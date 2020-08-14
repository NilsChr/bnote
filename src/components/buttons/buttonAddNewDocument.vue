<template>
  <v-btn
    class="mx-2 ma-0"
    fab
    dark
    color="secondary"
    small
    style="width:30px; height:30px;"
    @click="createNewDocument"
  >
    <v-icon dark>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
export default {
  methods: {
    async createNewDocument() {
      try {
        //let newDoc = await this.$store.dispatch("documents/createNewDocument");
        let newDoc = await this.$store.dispatch("documents_v2/createNewDocument");
        console.log('Created: ', newDoc)
        this.$store.dispatch("userFeedback/setText", {
          text: "Document succesfully created",
          color: "success",
        });
        this.$store.dispatch("documents_v2/loadDocuments");

        this.$store.dispatch("documents_v2/setSelectedDocument", newDoc);
      } catch (e) {
        this.$store.dispatch("userFeedback/setText", {
          text: "Something went wrong when creating document",
          color: "error",
        });
      }
    },
  },
};
</script>

<style>
</style>