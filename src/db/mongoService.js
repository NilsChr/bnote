import axios from "axios";
import auth from "../auth";
import { store } from "@/store";
import util from "../util/util";

const uri =
  process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "";

export const mongoService = {
  updateDocumentTimeout: null,
  updateTimeOut: null,
  getProfile() {
    return new Promise(async (resolve, reject) => {
      try {
        var token = await auth.user().getIdToken();
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        let user = await axios.get(uri + "/profile");

        resolve(user.data);
      } catch (e) {
        console.log("Get Profile", e);
        reject();
      }
    });
  },
  async createUser() {
    console.log(auth.user());
    let user = {
      userName: auth.user().displayName,
      photoURL: auth.user().photoURL,
    };
    var token = await auth.user().getIdToken();

    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    try {
      let newUser = await axios.post(uri + "/users", user);
      console.log(newUser);
    } catch (e) {
      console.log("Create User", e);
    }
  },
  async updateUser(user) {
    try {
      let currentUser = await axios.put(uri + "/users/" + user._id, user);
      store.dispatch("user/setCurrentUser", currentUser.data);
    } catch (e) {
      console.log("Create User", e);
    }
  },
  getUser(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await axios.get(uri + "/users/" + id);
        if (user.data) resolve(user.data);
        else resolve([]);
      } catch (e) {
        reject(e);
      }
    });
  },
  getUsers(searchString) {
    console.log("Searching", searchString);
    return new Promise(async (resolve, reject) => {
      try {
        let users = await axios.get(
          uri + "/services/searchUsers/" + searchString
        );
        if (users.data) resolve(users.data);
        else resolve([]);
      } catch (e) {
        reject(e);
      }
    });
  },
  async createDocument() {
    return new Promise(async (resolve, reject) => {
      try {
        let newDoc = await axios.post(uri + "/documents");
        resolve(newDoc.data);
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  },
  async getDocuments() {
    try {
      var token = await auth.user().getIdToken();
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      let documents = await axios.get(uri + "/documents");
      return documents;
    } catch (e) {
      console.log(e);
    }
  },
  async getDocument(id) {
    try {
      let document = await axios.get(uri + "/documents/" + id);
      return document.data;
    } catch (e) {
      console.log(e);
    }
  },
  async updateDocument() {
    clearTimeout(this.updateDocumentTimeout);
    this.updateDocumentTimeout = setTimeout(async function() {
      let id = store.getters["documents_v2/activeDocumentID"];
      let doc = store.getters["documents_v2/activeDocument"];
      console.log('Updating', doc);
      let newDoc = await axios.put(uri + "/documents/" + id, doc);
      //store.dispatch("documents_v2/updateDocument", newDoc.data);
    }, 200);
  },
  async updateDocumentData(data) {
    store.commit(
      "documents_v2/setCurrentDocumentSize",
      util.memorySizeOfInBytes(data)
    );
    clearTimeout(this.updateTimeOut);
    this.updateTimeOut = setTimeout(async function() {
      let id = store.getters["documents_v2/activeDocumentID"];
      let newDoc = await axios.put(uri + "/documents/" + id + "/data", {
        data: data,
      });
      store.dispatch("documents_v2/updateDocument", newDoc.data);
    }, 200);
  },
  async deleteDocument(id) {
    try {
      let deletedDoc = await axios.delete(uri + "/documents/" + id);
      return deletedDoc;
    } catch (e) {
      console.log(e);
    }
  },
  /**
   *
   * @param {*} documentId
   * @param {*} data requires authorId and editor {authorId: id, editor: boolean}
   */
  async shareDocument(documentId, data) {
    console.log('SHARE WITH', data);
    return new Promise(async (resolve, reject) => {
      try {
        let sharedDocument = await axios.put(
          uri + "/documents/" + documentId + "/sharedWith",
          data
        );
        resolve(sharedDocument);
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  },
  async unShareDocument(documentId, authorId) {
    console.log(authorId);
    return new Promise(async (resolve, reject) => {
      try {
        let sharedDocument = await axios.delete(
          uri + "/documents/" + documentId + "/sharedWith/" + authorId
        );
        resolve(sharedDocument);
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  },
  checkNicknameAvailability(nick) {
    return new Promise(async (resolve, reject) => {
      try {
        let available = await axios.get(
          uri + "/services/nickavailable/" + nick
        );
        resolve(available.data.available);
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  },
};
