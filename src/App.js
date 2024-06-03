import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [recommendedData, setRecommendedData] = useState([]);

  const apiKey = '895284fb2d2c50a520ea537456963d9c';

  const fetchWeather = async (location) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
  };


  const recommendedLocations = useMemo(() => ['Dubai', 'New York', 'London'], []);

  useEffect(() => {
    const fetchRecommendedData = async () => {
      const data = await Promise.all(recommendedLocations.map(location => fetchWeather(location)));
      setRecommendedData(data);
    };
  
    fetchRecommendedData();
  }, [recommendedLocations]);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation('');
    }
  };

  const resetData = () => {
    setData({});
    setLocation('');
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
        <button className="reset-button" onClick={resetData}>Reset</button>
      </div>
      <div className="container">
        {Object.keys(data).length === 0 && (
          <div className="cards">
            {recommendedData.map((locationData, index) => (
              <div className="card" key={index}>
                <div className="location">{locationData.name}</div>
                <div className="temp">{locationData.main.temp.toFixed()}°F</div>
                <div className="description">{locationData.weather[0].main}</div>
                <div className="details">
                  <div className="detail">Feels Like: {locationData.main.feels_like.toFixed()}°F</div>
                  <div className="detail">Humidity: {locationData.main.humidity}%</div>
                  <div className="detail">Wind Speed: {locationData.wind.speed.toFixed()} MPH</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {Object.keys(data).length !== 0 && (
          <>
            <div className="top">
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">
                {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
              </div>
              <div className="description">
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>
            </div>
            <div className="bottom">
              <div className="feels">
                {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className="wind">
                {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
                <p>Wind Speed</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
