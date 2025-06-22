// Test Firebase connection
import { auth, db } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

console.log('Firebase Auth:', auth)
console.log('Firebase DB:', db)

// Test auth state
onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user?.uid || 'No user')
})

// Test Firestore connection
async function testFirestore() {
  try {
    console.log('Testing Firestore connection...')
    const testDoc = doc(db, 'test', 'test')
    const docSnap = await getDoc(testDoc)
    console.log('Firestore test successful, doc exists:', docSnap.exists())
  } catch (error) {
    console.error('Firestore test failed:', error)
  }
}

testFirestore()
