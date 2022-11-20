import { useState } from 'react'

import CreateHabitForm from './CreateHabitForm'
import { Modal } from 'react-bootstrap'


function CreateHabit() {

  const [showForm, setShowForm] = useState(false)

  const hideForm = () => {
    setShowForm(!showForm)
  }

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-3 d-flex justify-content-center">
      {!showForm && (
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowForm(!showForm)} 
          data-bs-toggle="modal" 
          data-bs-target="#createHabitModal"
        >
          +
        </button>
      )}
      
      <Modal show={showForm} onHide={hideForm} centered className="px-3">
        <CreateHabitForm hideForm={hideForm}/>
      </Modal>
    </div>
  )
}

export default CreateHabit
