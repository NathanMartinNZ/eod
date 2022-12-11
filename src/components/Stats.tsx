import { useHabitStore, useHabitEntryStore } from "../store/store"
import StatsCalendar from "./StatsCalendar"


function Stats() {
  const habits:Habit[] = useHabitStore((state) => state.habits)
  const habitEntriesHist:HabitEntry[] = useHabitEntryStore((state) => state.habitEntriesHist)

  const getEntriesHistForHabitId = (id:string) => {
    return habitEntriesHist.filter((h) => h.habit_id === id)
  }

  const calcDayStreak = (entries:HabitEntry[]) => {
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0,0,0,0)
    let count = 0
    let sortedArr = entries.sort((a, b) => b.timestamp - a.timestamp)

    for(let i=0; i<sortedArr.length; i++) {
      if(!!sortedArr[i].complete && yesterday.getTime() - sortedArr[i].timestamp === i*86400000) {
        count++
      } else { break }
    }

    return count
  }

  const calcDaysSinceCreation = (createdTimestamp:any) => {
    const createdDate = new Date(createdTimestamp)
    const today = new Date()
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
    const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY)
  }

  const habitStatsText = (createdTimestamp:number|object, entries:HabitEntry[]) => {
    const entriesCopy = [...entries]
    if(!entries.length) { return "This was created today. Stats will show from tomorrow" }

    const daysSinceCreation = calcDaysSinceCreation(createdTimestamp)
    const daysCompleted = entriesCopy.filter((e) => !!e.complete).length
    const completePercent = Math.floor((daysCompleted/daysSinceCreation)*100) + "%"
    const dayStreak = calcDayStreak(entriesCopy)

    let text = <>You have completed this <b>{daysCompleted}</b> time{daysCompleted===1?'':'s'} since starting {daysSinceCreation} days ago ({completePercent}) 
    and are on a <b>{dayStreak}</b> day streak</>

    return text
  }

  return (
    <div className="container">
      {habits && habits.map(habit => (
        <div key={habit.id} className="container col-xl-10 col-xxl-8 px-4 py-3 border">
          <div className="row align-items-center g-lg-4 py-4">
            <div>
              <h2 className="h2">{habit.title}</h2>
            </div>
            <div>
              {habitStatsText(habit.timestamp, getEntriesHistForHabitId(habit.id))}
            </div>
            {getEntriesHistForHabitId(habit.id).length > 0 && (
              <div>
                <StatsCalendar entries={getEntriesHistForHabitId(habit.id)} />
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  )
}

export default Stats