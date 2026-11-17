import {useState} from 'react'
import {Eye,EyeOff,GraduationCap} from 'lucide-react'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {useAuth} from '../../hooks/useAuth.js'
import {usePreferences} from '../../hooks/usePreferences.js'

export default function RegisterPage(){
 const {register:registerUser,user}=useAuth();const navigate=useNavigate();const {t}=usePreferences();const [showPassword,setShowPassword]=useState(false);const [error,setError]=useState('')
 const {register,handleSubmit,getValues,formState:{errors,isSubmitting}}=useForm({defaultValues:{role:'student'}})
 if(user)return <Navigate to="/" replace/>
 const submit=async values=>{setError('');try{await registerUser(values);navigate('/',{replace:true})}catch(reason){setError(reason.message==='EMAIL_EXISTS'?t('emailAlreadyRegistered'):t('authError'))}}
 return <section className="auth-card"><div className="auth-heading-icon"><GraduationCap size={22}/></div><p className="eyebrow">{t('createAccount')}</p><h1>{t('registerTitle')}</h1><p className="muted">{t('registerDescription')}</p><form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
  <label>{t('fullName')}<input autoComplete="name" {...register('name',{required:true,minLength:2})}/>{errors.name&&<small className="field-error">{t('required')}</small>}</label>
  <label>{t('email')}<input type="email" autoComplete="email" {...register('email',{required:true,pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/})}/>{errors.email&&<small className="field-error">{t('validEmail')}</small>}</label>
  <label>{t('phone')}<input type="tel" autoComplete="tel" {...register('phone',{required:true,minLength:6})}/>{errors.phone&&<small className="field-error">{t('required')}</small>}</label>
  <label>{t('role')}<select {...register('role',{required:true})}><option value="admin">{t('admin')}</option><option value="teacher">{t('teacher')}</option><option value="student">{t('student')}</option></select></label>
  <label>{t('password')}<span className="password-field"><input type={showPassword?'text':'password'} autoComplete="new-password" {...register('password',{required:true,minLength:8})}/><button type="button" className="password-toggle" aria-label={showPassword?t('hidePassword'):t('showPassword')} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></span>{errors.password&&<small className="field-error">{t('passwordMinLength')}</small>}</label>
  <label>{t('confirmPassword')}<input type={showPassword?'text':'password'} autoComplete="new-password" {...register('passwordConfirmation',{required:true,validate:value=>value===getValues('password')})}/>{errors.passwordConfirmation&&<small className="field-error">{t('passwordMismatch')}</small>}</label>
  <p className="auth-demo-note">{t('localDemoAuthNotice')}</p>{error&&<p className="auth-error" role="alert">{error}</p>}<button className="button primary auth-submit" disabled={isSubmitting}>{isSubmitting?t('creatingAccount'):t('createAccount')}</button>
 </form><p className="auth-switch">{t('haveAccount')} <Link to="/login">{t('loginTitle')}</Link></p></section>
}
