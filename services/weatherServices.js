async function getData() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=41.673657233396&lon=34.75979783366156&appid=${WEATHER_API}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  getData();