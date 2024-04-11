import { createSignal } from 'solid-js'

const WeatherXday = ({ weatherDataDay }) => {
  const [currentDay, setCurrentDay] = createSignal(0)

  const handleNextDay = () => {
    setCurrentDay((currentDay + 1) % 4)
  }

  const handlePrevDay = () => {
    setCurrentDay((currentDay - 1 + 4) % 4)
  }

  return (
    <div className='weather-panel'>
      <button onClick={handlePrevDay}>Previous Day</button>
      <div className='weather-panel__day'>
        <h2>{weatherDataDay[currentDay].dt}</h2>
        <p>{weatherDataDay[currentDay].temperature}&#176;</p>
        <i className={`wi wi-owm-${weatherDataDay[currentDay].icon}`}></i>
      </div>
      <button onClick={handleNextDay}>Next Day</button>
    </div>
  )
}

export default WeatherXday
