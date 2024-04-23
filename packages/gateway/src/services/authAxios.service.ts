import axios from 'axios';


const instance = axios.create({
  baseURL: 'http://localhost:8080/',
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
        return Promise.reject(error);
      }

      // bad request
      case 400: {
        //toast.error("Something wrong from server");

        return Promise.reject(error);
      }

      // not found
      case 404: {
        //toast.error("Not found... ");

        return Promise.reject(error);
      }

      // conflict
      case 409: {
        return Promise.reject(error);
      }

      // unprocessable
      case 422: {
        return Promise.reject(error);
      }

      // generic api error (server related) unexpected
      default: {
        //toast.error("Something wrong... ");
        return Promise.reject(error);
      }
    }
  },
);
export default instance;
