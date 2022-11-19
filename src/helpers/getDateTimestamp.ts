const getDateTimestamp = () => {
  const date = new Date()
  date.setHours(0,0,0,0)
  return date.getTime()
}

export default getDateTimestamp