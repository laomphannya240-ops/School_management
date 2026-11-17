import {useState} from 'react'
import {ArrowLeft,KeyRound} from 'lucide-react'
import {Link,Navigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {useAuth} from '../../hooks/useAuth.js'
import {usePreferences} from '../../hooks/usePreferences.js'

export default function ForgotPasswordPage(){
 const {user,requestPasswordReset}=useAuth();const {t}=usePreferences();const [sent,setSent]=useState(false);const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm()
 if(user)return <Navigate to="/" replace/>
 const submit=async({email})=>{await requestPasswordReset(email);setSent(true)}
 return <section className="auth-card auth-compact"><div className="auth-heading-icon"><KeyRound size={22}/></div><p className="eyebrow">{t('passwordHelp')}</p><h1>{t('forgotPassword')}</h1><p className="muted">{t('forgotPasswordDescription')}</p>{sent?<p className="auth-success" role="status">{t('resetRequestSaved')}</p>:<form className="auth-form" onSubmit={handleSubmit(submit)}><label>{t('email')}<input type="email" autoComplete="email" {...register('email',{required:true,pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/})}/>{errors.email&&<small className="field-error">{t('validEmail')}</small>}</label><p className="auth-demo-note">{t('localResetNotice')}</p><button className="button primary auth-submit" disabled={isSubmitting}>{t('sendResetInstructions')}</button></form>}<Link className="back-link" to="/login"><ArrowLeft size={15}/>{t('backToLogin')}</Link></section>
}
