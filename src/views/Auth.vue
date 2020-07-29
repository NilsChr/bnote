<template>

  <v-container fill-height>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img src="../assets/blogal_logo.png" class="my-3" contain height="200" />
      </v-col>
      <v-col class="mb-4 pt-5">
        <div id="firebaseui-auth-container"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import auth from "@/auth";

export default {
  name: "auth",
  mounted() {
    auth.authForm("#firebaseui-auth-container");
  }
};
</script>

<style>
@import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>