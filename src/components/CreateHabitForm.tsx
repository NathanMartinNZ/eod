import React, { useState, useEffect } from 'react'
import useHabitStore from '../store/store'
import { v4 as uuidv4 } from 'uuid'

const defaultFormData = () => {
  return {
    "id": uuidv4(),
    "title": "",
    "description": "",
    "habitType": "boolean",
    "startingCount": 0,
    "goalCount": 3,
    "countDirection": "up",
    "status": {
      "complete": false,
      "count": 0
    }
  }
}

interface HideForm {
  hideForm: () => void;
}

function CreateHabitForm(props:HideForm) {

  const habits = useHabitStore((state) => state.habits)
  const addHabit = useHabitStore((state) => state.addHabit)

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

    // Reset form
    setFormData(defaultFormData())

    // Toggle form
    props.hideForm()
  }

  const logState = () => {
    console.log(habits)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="habitType">Type of habit</label>
        <select
          value={formData.habitType} 
          onChange={(e) => setFormData({...formData, habitType: e.target.value})}
          name="habitType"
        >
          <option value="boolean">One off (e.g. made bed)</option>
          <option value="count">Count (e.g. number of words written)</option>
        </select>
        <label htmlFor="title">Title</label>
        <input 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          type="text" 
          name="title"
        />
        <label htmlFor="description">Description</label>
        <input 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          type="text" 
          name="description"
        />
        {formData.habitType === "count" && 
          <>
            <label htmlFor="startingCount">Starting number</label>
            <input 
              value={formData.startingCount} 
              onChange={(e) => setFormData({
                ...formData, 
                startingCount: e.target.valueAsNumber, 
                status: {
                  ...formData.status,
                  count: e.target.valueAsNumber
                }
              })}
              type="number" 
              name="startingCount"
            />
            <label htmlFor="goalCount">Goal number</label>
            <input 
              value={formData.goalCount} 
              onChange={(e) => setFormData({...formData, goalCount: e.target.valueAsNumber})}
              type="number" 
              name="goalCount"
            />
          </>
        }
        <button type="submit">Add</button>
      </form>
      <button onClick={logState}>Log state</button>
    </div>
  )
}

export default CreateHabitForm