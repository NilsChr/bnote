<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
    data: () => ({
    }),
    computed: {
        snackbar() {
            return this.$store.getters['userFeedback/visible'];
        },
        text() {
            return this.$store.getters['userFeedback/text'];
        },
        timeout() {
            return this.$store.getters['userFeedback/timeout'];
        },
        color() {
            return this.$store.getters['userFeedback/color'];
        }
    }
  }
</script>

<style>

</style>