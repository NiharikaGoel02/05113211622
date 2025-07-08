import axios from 'axios';

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

export const Log = async (stack, level, packageName, message) => {
  try {
    const token = localStorage.getItem('accessToken');

    await axios.post(LOG_API_URL, {
      stack,
      level,
      package: packageName,
      message
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Logging failed:", error.response ? error.response.data : error.message);
  }
};
