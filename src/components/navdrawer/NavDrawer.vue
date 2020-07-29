<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent
    hide-overlay
    app
    clipped
  >
    <v-list-item class="px-2">
      <v-container class="pl-0">
        <v-layout justify-space-between>
          <v-btn
            icon
            @click.stop="mini = !mini"
            fab
            dark
            color="indigo"
            small
            style="width:30px; height:30px;"
          >
            <v-icon v-if="!mini">mdi-chevron-left</v-icon>
            <v-icon v-else>mdi-chevron-right</v-icon>
          </v-btn>
        </v-layout>
      </v-container>

      <v-container>
        <v-layout justify-end>
          <ButtonAddNewDocument />
        </v-layout>
      </v-container>
    </v-list-item>

    <v-list dense>
      <v-list-item>
        <v-list-item-icon v-if="mini">
          <v-icon>search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-field label="Title" dense v-model="searchTitle"></v-text-field>
          <v-text-field label="Topic" dense v-model="searchTopic"></v-text-field>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense two-line subheader v-if="!mini">
      <v-list-item
        v-for="document in filteredDocuments"
        :key="document.id"
        @click="loadDocument(document)"
        v-bind:class="{selected: selectedDocument && selectedDocument.id == document.id}"
      >
        <v-list-item-content>
          <v-list-item-title v-text="getTitle(document)"></v-list-item-title>
          <v-list-item-subtitle v-text="getTopic(document)"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import ButtonAddNewDocument from '../buttons/buttonAddNewDocument';

export default {
  name: "bnote-navdrawer",
  components: {
    ButtonAddNewDocument
  },
  data() {
    return {
      drawer: true,
      mini: false,
    };
  },
  methods: {
    loadDocument(document) {
      this.$store.dispatch("documents/setSelectedDocument", document);
    },
    getTitle(document) {
      if (document.data.title === "") return "Untitled document";
      return document.data.title;
    },
    getTopic(document) {
      if (document.data.topic === "") return "No topic";
      return document.data.topic;
    },
  },
  computed: {
    searchTitle: {
      set(val) {
        this.$store.dispatch("drawer/setSearchTitle", val);
      },
      get() {
        return this.$store.getters["drawer/search_title"];
      },
    },
    searchTopic: {
      set(val) {
        this.$store.dispatch("drawer/setSearchTopic", val);
      },
      get() {
        return this.$store.getters["drawer/search_topic"];
      },
    },
    documents() {
      return this.$store.getters["documents/documents"];
    },
    selectedDocument() {
      return this.$store.getters["documents/selectedDocumentMeta"];
    },
    filteredDocuments() {
      let documents = JSON.parse(JSON.stringify(this.documents));
      let filtered = [];
      for (let i = 0; i < documents.length; i++) {
        let topicMatch = documents[i].data.topic
          .toLowerCase()
          .includes(this.searchTopic.toLowerCase());
        if (this.searchTopic == "") topicMatch = true;

        let titleMatch = documents[i].data.title
          .toLowerCase()
          .includes(this.searchTitle.toLowerCase());
        if (this.searchTitle == "") titleMatch = true;

        if (topicMatch && titleMatch) filtered.push(documents[i]);
      }

      return filtered;
    },
  },
};
</script>

<style scoped>
.selected {
  border-left: 10px solid #69bd98;
  background-color: rgb(247, 247, 247);
}
</style>