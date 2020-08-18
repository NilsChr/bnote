const SELECTORS = {
    STATE_LOGIN: {
        googleSignInWithEmail:
        "#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li:nth-child(1) > button",
      googleSignInInputEmail: "#ui-sign-in-email-input",
      googleSignInInputPassword: "#ui-sign-in-password-input",
    },
    STATE_DASHBOARD: {
        navbar: {
            title: "#app > div > main > div > div > header > div > div.v-toolbar__title",
            avatar: "#app > div.v-application--wrap > main > div > div > header > div > div.v-avatar > img",
            btn_logout: "#btnlogout > div"
        },
        drawer: {
            list_documents: "#documents-list",
            btn_newDocument: "#blogal-btn-addnewdoc"
        }
    }
};

export default SELECTORS;
