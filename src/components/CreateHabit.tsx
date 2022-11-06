import { useState } from 'react'

import CreateHabitForm from './CreateHabitForm'

function CreateHabit() {

  const [formToggle, setFormToggle] = useState(false)

  const hideForm = () => {
    setFormToggle(!formToggle)
  }

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => setFormToggle(!formToggle)}>+</button>
      {formToggle && <CreateHabitForm hideForm={hideForm}/>}
    </div>
  )
}

export default CreateHabit
