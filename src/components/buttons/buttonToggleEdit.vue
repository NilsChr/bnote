<template>
  <v-btn
    class="mx-2 ma-0"
    fab
    dark
    :color="editColor()"
    small
    style="width:40px; height:40px;"
    @click="toggleEdit()"
    key="btnEdit"
    v-if="hasRights"
  >
    <v-icon dark>mdi-pencil</v-icon>
  </v-btn>
</template>

<script>
export default {
  methods: {
    editColor() {
      return this.canEdit ? "warning" : "grey";
    },

    toggleEdit() {
      this.canEdit = !this.canEdit;
      this.$store.dispatch("quillJS/disableEditor", this.canEdit);
    },


  },
  computed: {
    canEdit: {
      get() {
        return this.$store.getters["quillJS/canEdit"];
      },
      set(val) {
        this.$store.dispatch("quillJS/setCanEdit", val);
      },
    },
    hasRights() {
      let user = this.$store.getters['user/user'];
      let doc = this.$store.getters['documents_v2/activeDocument'];

      if(user._id == doc.authorId) return true;
      for(let i = 0; i < doc.sharedWith.length; i++) {
        if(user._id == doc.sharedWith[i].authorId && doc.sharedWith[i].editor) return true;
      }
      return false;
    }
  },
};
</script>

<style>
</style>