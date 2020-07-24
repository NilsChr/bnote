<template>

  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200" />
      </v-col>
      <v-col class="mb-4">
        <h1>Sign in</h1>
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