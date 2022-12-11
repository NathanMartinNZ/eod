import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'


function StatsCalendar({ entries }:{entries: HabitEntry[]}) {
  const [ tiles, setTiles ] = useState(Array.from({length: 30}, (v, k) => {
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0,0,0,0)

    return {
      tileId: uuidv4(),
      timestamp: yesterday.getTime() - k*86400000,
      complete: false
    }
  }).reverse())

  useEffect(() => {
    const newTiles = [...tiles].map(tile => {
      const matchingEntry = [...entries].find(entry => entry.timestamp === tile.timestamp)
      if(matchingEntry) { tile.complete = matchingEntry.complete }
      return tile
    })
    setTiles(newTiles)
  }, [entries])

  const Tile = ({ timestamp, complete }:{ timestamp:number, complete:boolean }) => {
    const date = new Date(timestamp)

    return (
      <div className={`stats-tile col-sm ${complete?'complete':''}`} title={date.toDateString()}></div>
    )
  }

  return (
    <div className="container">
      <div className="row">
        {tiles && tiles.map((tile, i) => (
          <Tile key={tile.tileId} {...tile} />
        ))}
      </div>
    </div>
  )
}

export default StatsCalendar