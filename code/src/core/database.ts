import { initializeApp } from 'firebase/app';
import { DatabaseReference, getDatabase, ref } from 'firebase/database';
import firebaseConfig from '@/secrets/database';
import userConfig from '@/secrets/user';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const authPromise = new Promise((resolve, reject) => {
  signInWithEmailAndPassword(auth, userConfig.email, userConfig.password)
      .then((result) => {
          resolve(ref(getDatabase(app), result.user.uid))
      })
      .catch((error) => {
          reject(error.message)
      });
});



export default authPromise as Promise<DatabaseReference>;