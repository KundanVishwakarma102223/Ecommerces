import axios from 'axios';

// Create Axios instance with the base URL from the .env file
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,  // Use the backend URL from the .env file
});

// Function to handle and extract error messages
export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message   // If the error has a response with a message from the server, return that
    : error.message;                 // Otherwise, return the generic error message
};

export default API; // Export the configured Axios instance for use in components
 
