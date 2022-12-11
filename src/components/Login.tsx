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
    <div className="col-12 col-md-5">
      <h2 className="h2">Sign in</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group py-2">
            <label htmlFor="email">Email</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
          </div>
          <div className="form-group py-2">
            <label htmlFor="password">Password</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <button className="btn btn-primary my-2" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}

export default Login