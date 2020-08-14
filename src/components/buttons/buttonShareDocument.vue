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
          {{shareWith}}
          <v-autocomplete
            v-model="shareWith"
            :disabled="isUpdating"
            :items="people"
            :search-input.sync="search"
            chips
            no-filter
            color="blue-grey lighten-2"
            label="Select"
            item-text="nickName"
            return-object
            multiple
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="remove(data.item)"
              >
                <v-avatar left>
                  <v-img :src="data.item.photoURL"></v-img>
                </v-avatar>
                {{ data.item.nickName }}
                <v-checkbox v-model="data.item.editor"></v-checkbox>
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item"></v-list-item-content>
              </template>
              <template v-else>
                <v-list-item-avatar>
                  <img :src="data.item.photoURL" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.nickName"></v-list-item-title>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="shareDocument(false)">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="shareDocument(true)">Share</v-btn>
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
    };
  },
  methods: {
    async openShareDialog() {
      this.dialog = true;
      if (!this.document) return;
      console.log("here", this.shareWith);

      for (let i = 0; i < this.document.sharedWith.length; i++) {
        let id = this.document.sharedWith[i].authorId;
        let user = await mongoService.getUser(id);
        let share = {
          _id: id,
          authorId: id,
          editor: this.document.sharedWith[i].authorId,
          nickName: user.nickName,
          photoURL: user.photoURL,
        };
        this.shareWith.push(share);
      }
      this.shareWith = [...this.shareWith];
      setTimeout(
        function () {
          this.shareWith = [
            {
              nickName: "test user1",
              photoURL:
                "https://lh4.googleusercontent.com/-pk6IOO5V_b0/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rf18ScEYjlz0DmTJLeN7-39S2uUKw/photo.jpg",
              _id: "5f36700e8cf506c14ec19cf7",
              editor: false,
            },
          ];
          console.log('LATE ADD')
        }.bind(this),
        1000
      );
    },
    shareDocument(willShare) {
      this.dialog = false;
      if (!this.document) return;

      if (willShare) {
        let sharedWith = 0;
        this.shareWith.forEach(
          async function (user) {
            await mongoService.shareDocument(this.document._id, {
              authorId: user._id,
              editor: user.editor,
            });
            sharedWith++;
            if (sharedWith == this.shareWith.length) {
              console.log("Shared complete");
            }
          }.bind(this)
        );
      }
    },
    remove(item) {
      const index = this.shareWith.findIndex((u) => u._id == item._id);
      if (index >= 0) this.shareWith.splice(index, 1);
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
              };
            });
          console.log(this.people);
        }.bind(this),
        250
      );
    },
  },
  async created() {
    console.log(this.shareWith);
  },
};
</script>

<style>
</style>