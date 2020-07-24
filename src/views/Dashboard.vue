<template>
  <v-container fluid class="pt-0 pl-0 pb-0" fill-height style="background-color: rgb(245,245,245);">
    <NavBar />
    <NavDrawer />
    <Document />
    <MessageSnackBar />
  </v-container>
</template>

<script>
import auth from "@/auth";
import NavBar from "@/components/navbar/NavBar.vue";
import NavDrawer from "@/components/navdrawer/NavDrawer.vue";
import MessageSnackBar from "@/components/messageSnackBar.vue";
import Document from "@/components/document.vue";

export default {
  name: "auth-success",
  components: {
    NavBar,
    NavDrawer,
    MessageSnackBar,
    Document
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    }
  },
  methods: {
    logOut() {
      auth.logout();
    }
  },
  created() {
    /*
    this.$store.dispatch("userFeedback/setText", {
      text: "Hello world",
      color: "success"
    });
    */
  }
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