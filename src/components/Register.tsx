import { useState } from "react"
import firebaseApp from '../firebaseApp'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth" 


function Register() {
  const auth = getAuth(firebaseApp)

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Send sign in email from firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
      })
      .catch((error) => {
        console.log(error)
      })

    setEmail("")
    setPassword("")
  }

  return (
    <div>
      <div></div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email"></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
          <label htmlFor="password"></label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
          <button>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register