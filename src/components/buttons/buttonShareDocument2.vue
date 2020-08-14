<template>
  <div>
    <v-btn
      class="mx-2 ma-0"
      fab
      dark
      color="primary"
      small
      style="width:40px; height:40px;"
      key="btnShare"
      @click="openShareDialog"
      :disabled="!canEdit"
      v-if="canEdit"
    >
      <v-icon dark>mdi-share-variant</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" persistent max-width="590">
      <v-card>
        <v-card-title class="headline">Share</v-card-title>
        <v-card-text>
          Lets do some sharing
          <v-flex xs12>
            <v-btn
              color="blue lighten-3"
              style="width: 15px; height: 15px; font-size: 8px"
              class="mr-2 disable-events"
              :ripple="false"
              depressed
            >Editors</v-btn>
            <v-btn
              color="grey lighten-3"
              style="width: 15px; height: 15px; font-size: 8px"
              class="mr-2 disable-events"
              :ripple="false"
              depressed
            >Viewers</v-btn>
          </v-flex>
          <v-combobox
            v-model="shareWith"
            :items="people"
            :search-input.sync="search"
            hide-selected
            hint
            label="Search for users to share with"
            multiple
            persistent-hint
            small-chips
            return-object
            item-text="nickName"
            v-if="!loadingShares"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "
                    <strong>{{ search }}</strong>".
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attrs, item, selected }">
              <v-chip
                v-if="item === Object(item)"
                v-bind="attrs"
                :input-value="selected"
                label
                :color="getColor(item.editor)"
              >
                <span class="pr-2">{{ item.nickName }}</span>
                <v-checkbox v-model="item.editor"></v-checkbox>
                <v-icon small @click="remove(item)">close</v-icon>
              </v-chip>
            </template>
          </v-combobox>
          <v-progress-circular v-if="loadingShares" indeterminate color="primary"></v-progress-circular>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="shareDocument(false)">Cancel</v-btn>
          <v-btn color="yellow darken-3" text @click="shareDocument(true)">Share</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mongoService } from "../../db/mongoService";
export default {
  data: () => {
    return {
      dialog: false,
      isUpdating: false,
      shareWith: [],
      people: [],
      search: null,
      searchTimeout: null,
      allreadySharedWith: [],
      unshare: [],
      loadingShares: false,
    };
  },
  methods: {
    async openShareDialog() {
      this.dialog = true;
      if (!this.document) return;
      this.shareWith = [];
      this.unshare = [];
      this.loadingShares = true;

      let dod = await mongoService.getDocument(this.document._id);

      for (let i = 0; i < dod.sharedWith.length; i++) {
        let id = dod.sharedWith[i].authorId;
        let user = await mongoService.getUser(id);
        let share = {
          _id: id,
          authorId: id,
          editor: dod.sharedWith[i].editor,
          nickName: user.nickName,
          photoURL: user.photoURL,
        };
        this.shareWith.push(share);
      }
      this.shareWith = [...this.shareWith];
      this.loadingShares = false;
    },
    shareDocument(willShare) {
      this.dialog = false;
      if (!this.document) return;
      let shareComplete = false;
      let unshareComplete = false;

      let that = this;
      function updateAfterShare(doc) {
        if (!shareComplete || !unshareComplete) return;
        that.$store.dispatch("documents_v2/updateLocalDocument", doc.data);
        that.$store.dispatch("documents_v2/setActiveDocument", doc.data);
      }

      if (willShare) {
        this.shareWith = this.shareWith.filter((f) => f instanceof Object);
        let sharedWith = 0;
        if (this.shareWith.length == 0) shareComplete = true;
        if (this.unshare.length == 0) unshareComplete = true;
        console.log('sharing with',this.shareWith)
        this.shareWith.forEach(
          async function (user) {
        console.log('sharing with',user)
            let doc = await mongoService.shareDocument(this.document._id, {
              authorId: user.authorId,
              editor: user.editor,
            });
            sharedWith++;
            if (sharedWith == this.shareWith.length) {
              shareComplete = true;
              updateAfterShare(doc);
            }
          }.bind(this)
        );

        let unSharedWith = 0;
        this.unshare.forEach(
          async function (user) {
            let doc = await mongoService.unShareDocument(
              this.document._id,
              user.authorId
            );
            unSharedWith++;
            if (unSharedWith == this.unshare.length) {
              unshareComplete = true;
              updateAfterShare(doc);
            }
          }.bind(this)
        );
      }
    },
    remove(item) {
      const index = this.shareWith.findIndex((u) => u._id == item._id);
      if (index >= 0) {
        let doc = this.shareWith.splice(index, 1)[0];
        this.unshare.push(doc);
      }
    },
    getColor(editor) {
      if (editor) return "blue lighten-3";
      return "grey lighten-3";
    },
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    document() {
      return this.$store.getters["documents_v2/activeDocument"];
    },
    canEdit: {
      get() {
        return this.$store.getters["quillJS/canEdit"];
      },
      set(val) {
        this.$store.dispatch("quillJS/setCanEdit", val);
      },
    },
    allPeople() {
      return [...this.allreadySharedWith, ...this.people];
    },
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000);
      }
    },
    search(val) {
      if (!val) return;
      val = val.replace(/\s/g, "");
      if (val == "") return;
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(
        async function () {
          this.people = await mongoService.getUsers(val);
          this.people = this.people
            .filter((p) => p._id != this.user._id)
            .map((u) => {
              return {
                nickName: u.nickName,
                photoURL: u.photoURL,
                _id: u._id,
                editor: false,
                authorId: u.googleId,
              };
            });
        }.bind(this),
        250
      );
    },
  },
  async created() {},
};
</script>

<style scoped>
.disable-events {
  pointer-events: none;
}
</style>