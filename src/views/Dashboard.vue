<template>
  <v-container fluid class="pt-0 pl-0 pb-0" fill-height style="background-color: rgb(245,245,245);">
    <NavBar />
    <NavDrawerMongo />
    <DocumentMongo />
    <MessageSnackBar />
  </v-container>
</template>

<script>
import auth from "@/auth";
import NavBar from "@/components/navbar/NavBar.vue";
import NavDrawer from "@/components/navdrawer/NavDrawer.vue";
import NavDrawerMongo from "@/components/navdrawer/NavDrawerMongo.vue";

import MessageSnackBar from "@/components/messageSnackBar.vue";
import Document from "@/components/document.vue";
import DocumentMongo from "@/components/documentMongo.vue";

export default {
  name: "auth-success",
  components: {
    NavBar,
    NavDrawer,
    NavDrawerMongo,
    MessageSnackBar,
    Document,
    DocumentMongo
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
  },
  methods: {
    logOut() {
      auth.logout();
    },
  },
  created() {
    /*
    this.$store.dispatch("userFeedback/setText", {
      text: "Hello world",
      color: "success"
    });
    */
    //this.$store.dispatch("user/loadProfile");
  },
};
</script>

<style scoped>
img {
  border-radius: 50px;
}

h3 {
  margin-bottom: 0;
}

p {
  margin-top: 0;
}

pre {
  text-align: left;
}
</style>