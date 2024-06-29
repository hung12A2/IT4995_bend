import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://it4995-bend-1.onrender.com/',
  // baseURL: 'http://localhost:7070/',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error.response?.status || 500;
    // we can handle global errors here
    switch (status) {
      // authentication (token related issues)
      case 401: {
        //toast.error("Unauthorized the user.Please login... ");
        return error.response.data;
      }

      // forbidden (permission related issues)
      case 403: {
        //toast.error("You don't have permission to access this resource...");
        return error.response.data;
      }

      // bad request
      case 400: {
        //toast.error("Something wrong from server");

        return error.response.data;
      }

      // not found
      case 404: {
        //toast.error("Not found... ");

        return error.response.data;
      }

      // conflict
      case 409: {
        return error.response.data;
      }

      // unprocessable
      case 422: {
        return error.response.data;
      }

      // generic api error (server related) unexpected
      default: {
        //toast.error("Something wrong... ");
        return error.response.data;
      }
    }
  },
);
export default instance;
