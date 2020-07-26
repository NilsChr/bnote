<template>
  <div>
    <v-btn
      class="mx-2 ma-0"
      fab
      dark
      color="error"
      small
      style="width:40px; height:40px;"
      @click="deleteModal = true"
      :disabled="!canEdit"
      v-if="canEdit"
      key="btnDelete"
    >
      <v-icon dark>mdi-delete</v-icon>
    </v-btn>

    <v-dialog v-model="deleteModal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Delete document?</v-card-title>
        <v-card-text>Are you sure you want to delete this document?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDocument(false)">No</v-btn>
          <v-btn color="red darken-1" text @click="deleteDocument(true)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    deleteModal: false,
  }),
  methods: {
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
    }
  }
};
</script>

<style>
</style>