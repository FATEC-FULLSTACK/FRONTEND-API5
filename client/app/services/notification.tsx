import axios from "axios";

const BASE_URL = "http://localhost:3000/notification";

interface sendWeatherDataProps {
  temperatura?: string;
  umidade?: string;
  precipitacao?: string;
}

export const sendWeatherData = async (data: sendWeatherDataProps) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data);
    return response.data;
  } catch (err) {
    throw err;
  }
};
