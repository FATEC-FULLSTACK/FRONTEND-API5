

exports.fetchAllWeatherData = async (latitude, longitude) => {
	try {
	  const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation&timezone=America/Sao_Paulo`
	  );
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const weatherData = await response.json();
	  return weatherData;
	} catch (error) {
	  console.error("Failed to fetch weather data:", error);
	  throw error;
	}
};


exports.fetchTemperatureData = async (latitude, longitude) => {
	try {
	  const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=America/Sao_Paulo`
	  );
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const weatherData = await response.json();
	  return weatherData;
	} catch (error) {
	  console.error("Failed to fetch weather data:", error);
	  throw error;
	}
};

exports.fetchHumidityData = async (latitude, longitude) => {
	try {
	  const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m&timezone=America/Sao_Paulo`
	  );
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const weatherData = await response.json();
	  return weatherData;
	} catch (error) {
	  console.error("Failed to fetch weather data:", error);
	  throw error;
	}
};

exports.fetchPrecipitationChanceData = async (latitude, longitude) => {
	try {
	  const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation_probability&timezone=America/Sao_Paulo`
	  );
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const weatherData = await response.json();
	  return weatherData;
	} catch (error) {
	  console.error("Failed to fetch weather data:", error);
	  throw error;
	}
};


exports.fetchPrecipitationData = async (latitude, longitude) => {
	try {
	  const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation&timezone=America/Sao_Paulo`
	  );
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const weatherData = await response.json();
	  return weatherData;
	} catch (error) {
	  console.error("Failed to fetch weather data:", error);
	  throw error;
	}
};



exports.fetchHistoricData = async (latitude, longitude, start, end) => {
	try {
	  const response = await fetch(
		`https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${start}&end_date=${end}&hourly=temperature_2m,relative_humidity_2m,precipitation&timezone=America%2FSao_Paulo&format=flatbuffers`
	  );
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const weatherData = await response.json();
	  return weatherData;
	} catch (error) {
	  console.error("Failed to fetch weather data:", error);
	  throw error;
	}
};