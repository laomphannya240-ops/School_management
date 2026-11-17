import {useState} from 'react'
import {Eye,EyeOff,Shield} from 'lucide-react'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {useAuth} from '../../hooks/useAuth.js'
import {usePreferences} from '../../hooks/usePreferences.js'

export default function LoginPage(){
 const {login,loginDemo,user}=useAuth();const navigate=useNavigate();const {t}=usePreferences();const [showPassword,setShowPassword]=useState(false);const [error,setError]=useState('')
 const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm({defaultValues:{remember:true}})
 if(user)return <Navigate to="/" replace/>
 const submit=async({email,password,remember})=>{setError('');try{await login(email,password,remember);navigate('/',{replace:true})}catch(reason){setError(reason.message==='INVALID_CREDENTIALS'?t('invalidCredentials'):t('authError'))}}
 const chooseDemo=role=>{loginDemo(role);navigate('/',{replace:true})}
 return <section className="auth-card"><div className="auth-heading-icon"><Shield size={22}/></div><p className="eyebrow">{t('welcomeBack')}</p><h1>{t('loginTitle')}</h1><p className="muted">{t('loginDescription')}</p><form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
  <label>{t('email')}<input type="email" autoComplete="username" {...register('email',{required:true,pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/})}/>{errors.email&&<small className="field-error">{t('validEmail')}</small>}</label>
  <label>{t('password')}<span className="password-field"><input type={showPassword?'text':'password'} autoComplete="current-password" {...register('password',{required:true})}/><button type="button" className="password-toggle" aria-label={showPassword?t('hidePassword'):t('showPassword')} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></span>{errors.password&&<small className="field-error">{t('required')}</small>}</label>
  <div className="auth-options"><label className="remember-option"><input type="checkbox" {...register('remember')}/>{t('rememberMe')}</label><Link to="/forgot-password">{t('forgotPassword')}</Link></div>
  {error&&<p className="auth-error" role="alert">{error}</p>}<button className="button primary auth-submit" disabled={isSubmitting}>{isSubmitting?t('signingIn'):t('loginTitle')}</button>
 </form><div className="auth-divider"><span>{t('orUseDemoAccount')}</span></div><div className="demo-role-list">{['admin','teacher','student'].map(role=><button key={role} className="demo-role" onClick={()=>chooseDemo(role)}><span className={`avatar ${role}`}>{role[0].toUpperCase()}</span><span>{t(role)}</span></button>)}</div><p className="auth-demo-note">{t('localDemoAuthNotice')}</p><p className="auth-switch">{t('noAccount')} <Link to="/register">{t('registerTitle')}</Link></p></section>
}
