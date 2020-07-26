<template>
  <v-app-bar color="primary accent-4" dense dark app clipped-left>

    <v-toolbar-title>BLOGAL</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu left bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar size="30" v-bind="attrs" v-on="on">
          <img alt="Avatar" :src="user.photoURL" />
        </v-avatar>
      </template>

      <v-list>
        <v-list-item v-for="(option, index) in profile_options" :key="index" @click="() => {}">
          <v-list-item-title @click="option.action">{{option.title}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import auth from "@/auth";
export default {
  name: "bnote-navbar",
  data() {
      return {
          profile_options: [
              { title: 'Logout', action: this.logOut}
          ]
      }
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
  }
};
</script>

<style>
</style>