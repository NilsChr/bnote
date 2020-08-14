<template>
  <v-app-bar color="primary accent-4" dense dark app clipped-left>

    <v-toolbar-title @click="goToDashboard">BLOGAL</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu left bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar size="30" v-bind="attrs" v-on="on" v-if="user">
          <img alt="Avatar" :src="user.photoURL" />
        </v-avatar>
      </template>

      <v-list>
        <!--
        <v-list-item v-for="(option) in profile_options" :key="option.key" @click="() => {}">
          <v-list-item-title @click="option.action">{{option.title}}</v-list-item-title>
        </v-list-item>
        -->
        <v-list-item id="btnprofile" :key="'btnprofile'">
          <v-list-item-title @click="goToProfile">Profile</v-list-item-title>
        </v-list-item>
        <v-list-item id="btnlogout" :key="'btnlogout'">
          <v-list-item-title @click="logOut">Logout</v-list-item-title>
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
              { title: 'Profile', action: this.goToProfile, key:"btnProfile" },
              { title: 'Logout', action: this.logOut, key:"btnLogout"}
          ]
      }
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    }
  },
  methods: {
    goToDashboard() {
      this.$router.push('dashboard');
    },
    goToProfile() {
      this.$router.push('profile');
    },
    logOut() {
      auth.logout();
    }
  }
};
</script>

<style>
</style>