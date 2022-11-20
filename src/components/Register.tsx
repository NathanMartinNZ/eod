import { useState } from "react"
import firebaseApp from '../firebaseApp'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth" 


function Register() {
  const auth = getAuth(firebaseApp)

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // // Send sign in email from firebase
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     console.log(userCredential)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })

    setEmail("")
    setPassword("")
  }

  return (
    <div className="col col-12 col-md-5">
      <h2 className="h2">Register</h2>
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
          <button className="btn btn-primary my-2" type="submit" disabled>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register