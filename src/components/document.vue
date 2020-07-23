<template>
  <v-container fluid class="pt-0 pb-0" fill-height>
    <v-layout v-if="loadingDocument" justify-space-around>
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
          <v-slide-x-transition group>
            <v-btn
              class="mx-2 ma-0"
              fab
              dark
              color="red"
              small
              style="width:40px; height:40px;"
              @click="deleteModal = true"
              :disabled="!canEdit"
              v-if="canEdit"
              key="btnDelete"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </v-slide-x-transition>
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

          <v-btn
            class="mx-2 ma-0"
            fab
            dark
            :color="editColor()"
            small
            style="width:40px; height:40px;"
            @click="toggleEdit()"
            key="btnEdit"
          >
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            class="mx-2 ma-0"
            fab
            dark
            color="primary"
            small
            style="width:40px; height:40px;"
            key="btnShare"
          >
            <v-icon dark>mdi-share-variant</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>

      <!-- QUILL EDITOR -->
      <bnote-quill :edit="canEdit" />
    </v-layout>
  </v-container>
</template>

<script>
import bnoteQuill from "@/components/editors/bnoteQuill";

export default {
  components: {
    bnoteQuill
  },
  data: () => ({
    deleteModal: false,
    //edit: false,
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
        return this.$store.getters["quillJS/canEdit"]
      },
      set(val) {
        this.$store.dispatch("quillJS/setCanEdit", val);
      }
    }
  },
  mounted() {}
};
</script>

<style>
</style>