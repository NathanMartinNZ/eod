import React, { useState, useEffect } from 'react'
import { useHabitStore, useHabitEntryStore, useUserStore } from '../store/store'
import { v4 as uuidv4 } from 'uuid'
import { serverTimestamp } from 'firebase/database'
import getDateTimestamp from '../helpers/getDateTimestamp'
import HabitEntry from '../interfaces/HabitEntry.interface'
import { Modal } from 'react-bootstrap'


const defaultFormData = () => {
  return {
    "timestamp": serverTimestamp(),
    "id": uuidv4(),
    "title": "",
    "description": "",
    "habitType": "boolean",
    "startingCount": 0,
    "goalCount": 3,
    "countDirection": "up"
  }
}

interface HideForm {
  hideForm: () => void;
}

function CreateHabitForm(props:HideForm) {
  const addHabit = useHabitStore((state) => state.addHabit)
  const addHabitEntry = useHabitEntryStore((state) => state.addHabitEntry)

  const [formData, setFormData] = useState(defaultFormData())

  // Update countDirection when value changes
  useEffect(() => {
    setFormData(() => {
      const formDataCopy = {...formData}
      if(formDataCopy.habitType === "count") {
        formDataCopy.startingCount <= formDataCopy.goalCount ? formDataCopy.countDirection = "up" : formDataCopy.countDirection = "down"
      }
      return formDataCopy
    })
    // eslint-disable-next-line
  }, [formData.startingCount, formData.goalCount])

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Add habit to state
    addHabit(formData)

    // Add habit entry to state
    const entry:HabitEntry = {
      timestamp: getDateTimestamp(),
      id: uuidv4(),
      habit_id: formData.id,
      complete: false,
      count: formData.startingCount
    }
    addHabitEntry(entry)

    // Reset form
    setFormData(defaultFormData())

    // Toggle form
    props.hideForm()
  }

  return (
    <>
    <Modal.Header closeButton>
      <h2 className="h2">Create habit</h2>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit}>
        <div className="form-group pb-2">
          <label htmlFor="habitType">Type of habit</label>
          <select
            className="form-select"
            value={formData.habitType} 
            onChange={(e) => setFormData({...formData, habitType: e.target.value})}
            name="habitType"
          >
            <option value="boolean">One off (e.g. made bed)</option>
            <option value="count">Count (e.g. number of words written)</option>
          </select>
        </div>
        <div className="form-group py-2">
          <label htmlFor="title">Title*</label>
          <input 
            className="form-control"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            type="text" 
            name="title"
            required
          />
        </div>
        <div className="form-group py-2">
          <label htmlFor="description">Description</label>
          <textarea 
            className="form-control"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            name="description"
          />
        </div>
        {formData.habitType === "count" && 
          <>
          <div className="form-group py-2">
            <label htmlFor="startingCount">Starting number*</label>
            <input 
              className="form-control"
              value={formData.startingCount.toString()} 
              onChange={(e) => setFormData({
                ...formData, 
                startingCount: e.target.valueAsNumber
              })}
              type="number" 
              name="startingCount"
              required
            />
          </div>
          <div className="form-group py-2">
            <label htmlFor="goalCount">Goal number*</label>
            <input 
              className="form-control"
              value={formData.goalCount.toString()} 
              onChange={(e) => setFormData({...formData, goalCount: e.target.valueAsNumber})}
              type="number" 
              name="goalCount"
              required
            />
          </div>
          </>
        }
        <button className="btn btn-primary mt-2" type="submit">Create</button>
      </form>
    </Modal.Body>
    </>
  )
}

export default CreateHabitForm