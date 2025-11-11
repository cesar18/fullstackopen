import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryName = ({name, handleClickCountry}) => <p>{name} <button onClick={handleClickCountry(name)}>Show</button></p>
const Country = ({name, capital, area, languages, flag, altFlag}) => {
  return (
    <>
    <h1>{name}</h1>
    <p>
      Capital {capital} <br/>
      Area {area}
    </p>
    <h2>Languages</h2>
      <ul>
        {Object.values(languages).map((language, i)=><li key={i}>{language}</li>)}
      </ul>
      <img src={flag} alt={altFlag}/>
    </>
  )
}

const Weather = ({lat, lon, capital}) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_API_KEY
  useEffect(()=>{
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response=>{
        setWeather({
          temprature: response.data.main.temp,
          wind: response.data.wind.speed,
          weatherIcon:`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        })
      })
  },[])
  if(weather == null){
    return null
  }
  return(
  <div>
    <h1>Weather in {capital}</h1>
    <p>Temperature {weather.temprature} Celsius</p>
    <img src={weather.weatherIcon}/>
    <p>Wind {weather.wind} m/s </p>
  </div>
  )
}

const Countries = ({countries, handleClickCountry}) => {
  if(countries.length === 0){
    return null
  }
  if(countries.length > 10){
    return <p>Too many matches, specify another filter</p>
  }
  if(countries.length > 1){
    return countries.map((country, i)=><CountryName key={i} name={country.name.common} handleClickCountry={handleClickCountry}/>)
  }
  const [lat, lon] = countries[0].capitalInfo.latlng

  return <> 
    <Country 
      name={countries[0].name.common}
      capital={countries[0].capital[0]}
      area={countries[0].area}
      languages={countries[0].languages}
      flag={countries[0].flags.png}
      altFlag={countries[0].flags.alt}
    />
    <Weather lat={lat} lon={lon} capital={countries[0].capital[0]}/>
  </>
}

const App = () => {
  const [countryName, setCountryName] = useState('')
  const [countriesFound, setCountriesFound] = useState([])
  useEffect(()=>{
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response=>{
        setCountriesFound(response.data.filter(country=>country.name.common.toLowerCase().includes(countryName)))
      })
  },[countryName])
  
  const handleChangeCountry = (event) => {
    setCountryName(event.target.value.toLowerCase())
  }

  const handleClickCountry = (name) => () => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`)
      .then(response=>{
        setCountriesFound([response.data])
      })
  }

  return (
    <>
      <input name="countryName" value={countryName} onChange={handleChangeCountry}/>
      <Countries countries={countriesFound} handleClickCountry={handleClickCountry} />
    </>
  )
}

export default App