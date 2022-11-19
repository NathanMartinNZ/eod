import { useState } from "react"
import firebaseApp from '../firebaseApp'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth" 


function Login() {
  const auth = getAuth(firebaseApp)

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Send sign in email from firebase
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
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
          <button>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login