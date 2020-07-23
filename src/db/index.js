import auth from '../auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {store} from '@/store';

const test = process.env.NODE_ENV === 'development' ? '_test' : '';

export const db = {
    firebase_collections: {
        documentMeta: 'bnote_document_meta' + test,
        documentData: 'bnote_document_data' + test
    },

    createNewDocument() {
        return new Promise(async (resolve) => {
            let dataDocument = await firebase.firestore().collection(db.firebase_collections.documentData).doc();
            await dataDocument.set({});
            let newDoc = {
                title: '',
                topic: '',
                created: new Date().getTime(),
                author: auth.user().uid,
                sharedWith: [],
                data: dataDocument.id,
                lastEdit: {
                    user: auth.user().uid,
                    date: new Date().getTime(),
                }
            }

            await firebase.firestore().collection(db.firebase_collections.documentMeta).doc().set(newDoc);
            resolve('Document created');
        }, (reject) => {
            reject('An error occured when creating the document');
        })
    },

    loadDocuments() {
        firebase.firestore().collection(db.firebase_collections.documentMeta).onSnapshot((snapshot) => {
            let documents = [];
            snapshot.docs.forEach(doc => {
                let data = {
                    id: doc.id,
                    data: doc.data()
                };
                documents.push(data);
            });
            store.dispatch('documents/setDocuments', documents);
        })
    },

    loadDocumentData(id) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection(db.firebase_collections.documentData).doc(id).get().then(document => {
                resolve(document.data());
            }).catch(e => {
                reject(e);
            })
        })
    },

    deleteDocument(documentaMeta) {
        return new Promise(async (resolve, reject) => {
            try {
                await firebase.firestore().collection(db.firebase_collections.documentData).doc(documentaMeta.data.data).delete();
                await firebase.firestore().collection(db.firebase_collections.documentMeta).doc(documentaMeta.id).delete();
                resolve();
            } catch(e) {
                reject(e);
            }
        })
    },

    updateDocument(document) {
        document.data.lastEdit = {
            user: auth.user().uid,
            date: new Date().getTime(),
        }
        firebase.firestore().collection(db.firebase_collections.documentMeta).doc(document.id).set(document.data, {merge: true});
    },

    updateDocumentData(data) {
        let documentId = store.getters['documents/selectedDocumentMeta'].data.data;
        firebase.firestore().collection(db.firebase_collections.documentData).doc(documentId).set({data:data});
    }

}