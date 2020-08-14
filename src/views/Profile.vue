<template>
  <v-container fluid class="pt-0 pl-0 pb-0" fill-height style="background-color: rgb(245,245,245);">
    <NavBar />
    <v-layout justify-center align-center wrap>
      <v-flex xs4>
        <v-card class="pa-5">
          <v-flex xs12 class="pa-3">
            <v-layout>
              <v-flex xs4>
                <v-avatar size="90">
                  <img style="border: 2px solid #232323;" :src="user.photoURL" />
                </v-avatar>
              </v-flex>
              <v-flex xs8 class="pt-5">
                <v-flex xs12>
                  <strong>{{user.userName}}</strong>
                </v-flex>
                <v-flex xs12>
                    Joined {{joinedDate}}
                </v-flex>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 class="pa-3">
            <v-layout justify-center>
              <v-flex xs8 class="pt-5">
                <v-text-field
                  label="Nickname"
                  outlined
                  dense
                  v-model="nickName"
                  :loading="nickNameChecking"
                  :error="nickNameTaken"
                  :error-messages="nickNameTakenMSG"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 class="pa-3">
            <v-layout justify-center>
              <v-flex xs4 class="pt-2">
                <v-btn
                  color="warning"
                  :disabled="!validUpdate"
                  @click="updateProfile"
                >Update Profile</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import auth from "@/auth";
import NavBar from "@/components/navbar/NavBar.vue";
import { mongoService } from "../db/mongoService";
export default {
  name: "auth-success",
  components: {
    NavBar,
  },
  data: () => {
    return {
      nickName: "",
      nickNameCheckTimer: null,
      nickNameTaken: false,
      nickNameChecking: false,
      nickNameTakenMSG: "",
      validUpdate: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    joinedDate() {
        return this.user.created.substring(0,10);
    }
  },
  methods: {
    logOut() {
      auth.logout();
    },
    updateProfile() {
      this.user.nickName = this.nickName;
      mongoService.updateUser(this.user);
      this.validUpdate = false;
    },
  },
  created() {
    this.nickName = this.user.nickName || "";
  },
  watch: {
    nickName() {
      if (this.nickName == this.user.nickName) {
        clearTimeout(this.nickNameCheckTimer);
        this.nickNameChecking = false;
        this.nickNameTakenMSG = "";
        this.validUpdate = false;
        return;
      }

      if (this.nickName == "") {
        clearTimeout(this.nickNameCheckTimer);
        this.nickNameChecking = false;
        this.nickNameTakenMSG = "";
        this.nickNameTakenMSG = "Nickname is must be longer";
        this.validUpdate = false;
        return;
      }
      if (this.nickName.indexOf(" ") >= 0) {
        clearTimeout(this.nickNameCheckTimer);
        this.nickNameChecking = false;
        this.nickNameTakenMSG = "";
        this.nickNameTakenMSG = "No spaces allowed";
        this.validUpdate = false;
        return;
      }
      this.nickNameChecking = true;

      clearTimeout(this.nickNameCheckTimer);
      this.nickNameCheckTimer = setTimeout(
        async function () {
          let availability = await mongoService.checkNicknameAvailability(
            this.nickName
          );
          if (!availability) {
            this.nickNameTakenMSG = "Nickname is taken";
            this.validUpdate = false;
          } else {
            this.nickNameTakenMSG = "";
            this.validUpdate = true;
          }
          this.nickNameTaken = !availability;
          this.nickNameChecking = false;
        }.bind(this),
        250
      );
    },
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