import { initializeApp } from 'firebase/app'
import firebaseConfig from './firebaseServiceAccountKey.js'

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp