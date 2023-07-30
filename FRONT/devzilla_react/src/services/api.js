import axios from "axios";

const baseURL = 'https://investiumpython-1-h3568230.deta.app'

const api = axios.create({
    baseURL,
    timeout: 5000,
    resolve: {
        fallback: {
          "http": false
        }
      }
})

export default api