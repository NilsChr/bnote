import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#324058", //#3f51b5  324058
        secondary: "#69bd98",
        accent: "#8c9eff",
        error: "#b71c1c",
        success: "#69bd98"
      },
    },
  },
});
