import axios from 'axios'
export const api=axios.create({baseURL:import.meta.env?.VITE_API_URL||'http://127.0.0.1:8000/api',headers:{Accept:'application/json','Content-Type':'application/json'}})
api.interceptors.request.use(config=>{const token=localStorage.getItem('sms-token');if(token)config.headers.Authorization=`Bearer ${token}`;return config})
api.interceptors.response.use(response=>response.data,error=>{const message=error.response?.data?.message||error.message||'Something went wrong';return Promise.reject(Object.assign(new Error(message),{status:error.response?.status,errors:error.response?.data?.errors}))})
