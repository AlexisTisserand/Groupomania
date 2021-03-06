import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/main.scss'


//redux
import { Provider } from 'react-redux'
import store from './store'
import axios from 'axios'

axios.interceptors.request.use(
  request => {
    
    if (localStorage.getItem('user') !== null) {
      const accessToken = JSON.parse(localStorage.getItem('user')).accessToken
      if (accessToken) {
        request.headers.Authorization = 'Bearer ' + accessToken
      }
    }
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(response => {
  
  return response
})

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

// axios.interceptors.request.use(request => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const token = user.accessToken
//   if (token) {
//     request.headers['Authorization'] = 'Bearer ' + token
//   }
//   return request;
// }, error => {
//   Promise.reject(error)
// })

// axios.interceptors.response.use(response => {
//   // console.log(response);
//   return response
// },
// function(error) {
//   const originalRequest = error.config;
//   if (error.response.status === 401 && !originalRequest._retry) {
//     console.log("test");
//   }
// })
