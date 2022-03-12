import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import firebaseConfig from '@/secrets/database';
import { getAuth, signInWithRedirect, getRedirectResult, GithubAuthProvider } from "firebase/auth";

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GithubAuthProvider();
const authPromise = new Promise((resolve, reject) => {
    getRedirectResult(auth)
        .then((result) => {
            if (result === null) {
                signInWithRedirect(auth, provider)
                return reject("Redirecting...")
            }
            resolve(ref(getDatabase(app), result.user.uid))
        }).catch((error) => {
            reject(error.message)
        });
});



export default authPromise;