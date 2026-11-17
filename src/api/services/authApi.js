import {api} from '../axios.js'
import {endpoints} from '../endpoints.js'

export const authApi={
 register:payload=>api.post(endpoints.auth.register,payload),
 login:payload=>api.post(endpoints.auth.login,payload),
 logout:()=>api.post(endpoints.auth.logout),
 current:()=>api.get(endpoints.auth.me),
 forgotPassword:payload=>api.post(endpoints.auth.forgotPassword,payload)
}
