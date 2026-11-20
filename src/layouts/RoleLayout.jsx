import {useEffect,useRef,useState} from 'react'
import {Activity,Bell,BookOpen,CalendarDays,Check,ChevronDown,ChevronRight,ClipboardList,CreditCard,GraduationCap,LayoutDashboard,LogOut,Menu,Moon,Settings,Shield,Sun,Users,X} from 'lucide-react'
import {Navigate,Outlet,useLocation,useNavigate} from 'react-router-dom'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'
import NotificationDropdown from '../components/common/NotificationDropdown.jsx'
import {canAccessModule,roleModules} from '../constants/permissions.js'
import {useAuth} from '../hooks/useAuth.js'
import {usePreferences} from '../hooks/usePreferences.js'
import {useToast} from '../hooks/useToast.js'

const navigationIcons={dashboard:LayoutDashboard,students:GraduationCap,teachers:Users,classes:BookOpen,subjects:ClipboardList,academicyears:CalendarDays,attendance:CalendarDays,exams:ClipboardList,grades:Activity,schedules:CalendarDays,payments:CreditCard,users:Users,reports:Activity,notifications:Bell,settings:Settings,myclasses:BookOpen,mystudents:GraduationCap,myschedule:CalendarDays,myattendance:CalendarDays,myresults:Activity,profile:Shield}

export default function RoleLayout(){
 const {user,logout}=useAuth()
 const {t,lang,setLang,theme,toggleTheme}=usePreferences()
 const toast=useToast()
 const location=useLocation()
 const navigate=useNavigate()
 const [drawer,setDrawer]=useState(false)
 const [notice,setNotice]=useState(false)
 const [supportOpen,setSupportOpen]=useState(false)
 const [logoutOpen,setLogoutOpen]=useState(false)
 const [langOpen,setLangOpen]=useState(false)
 const [currentTime,setCurrentTime]=useState(()=>new Date())
 const langMenuRef=useRef(null)
 useEffect(()=>{const timer=window.setInterval(()=>setCurrentTime(new Date()),60_000);return ()=>window.clearInterval(timer)},[])
 useEffect(()=>{
  if(!langOpen)return undefined
  const onPointerDown=(event)=>{if(langMenuRef.current&&!langMenuRef.current.contains(event.target))setLangOpen(false)}
  const onKeyDown=(event)=>{if(event.key==='Escape')setLangOpen(false)}
  document.addEventListener('mousedown',onPointerDown)
  document.addEventListener('keydown',onKeyDown)
  return ()=>{document.removeEventListener('mousedown',onPointerDown);document.removeEventListener('keydown',onKeyDown)}
 },[langOpen])
 const changeLanguage=(next)=>{
  if(next===lang){setLangOpen(false);return}
  setLang(next)
  setLangOpen(false)
  toast.success(next==='km'?'បានប្តូរភាសាទៅខ្មែរ':'Language changed to English')
 }

 if(!user)return <Navigate to="/login" replace/>
 const active=location.pathname.split('/')[1]||'dashboard'
 const allowed=roleModules[user.role]||[]
 if(!canAccessModule(user.role,active))return <Navigate to="/" replace/>

 return <div className={`app-shell ${theme}`}>
  <aside className={`sidebar ${drawer?'open':''}`}>
   <div className="brand"><div className="brand-mark"><GraduationCap size={23}/></div><span><b>SMS</b><small>School portal</small></span><button className="icon-btn drawer-close" aria-label={t('close')} onClick={()=>setDrawer(false)}><X size={18}/></button></div>
   <div className="school-switch"><div className="school-emblem">K</div><span><b>សាលាបឋមសិក្សា</b><small>Phnom Penh, Cambodia</small></span></div>
   <p className="nav-label">{t('workspace')}</p>
   <nav>{allowed.map(key=>{const Icon=navigationIcons[key]||LayoutDashboard;return <button key={key} className={`nav-item ${active===key?'active':''}`} onClick={()=>{navigate(key==='dashboard'?'/':`/${key}`);setDrawer(false)}}><Icon size={18}/><span>{t(key)}</span>{key==='notifications'&&<i className="nav-dot"/>}</button>})}</nav>
   <div className="sidebar-bottom"><div className="support-card"><div className="support-mark">✦</div><b>{t('needHelp')}</b><small>{t('helpDescription')}</small><button onClick={()=>setSupportOpen(true)}>{t('contactSupport')} <ChevronRight size={14}/></button></div><button className="user-row" onClick={()=>setLogoutOpen(true)}><div className={`avatar ${user.role}`}>{user.name[0]}</div><span><b>{user.name}</b><small>{t(user.role)}</small></span><LogOut size={16}/></button></div>
  </aside>
  {drawer&&<button className="scrim" aria-label={t('close')} onClick={()=>setDrawer(false)}/>}
  <main className="main-area">
   <header className="topbar"><button className="icon-btn menu-btn" aria-label={t('openMenu')} onClick={()=>setDrawer(true)}><Menu size={20}/></button><div className="breadcrumb">{t('workspace')} <ChevronRight size={14}/> <b>{t(active)}</b></div><div className="top-actions"><span className="today-label"><CalendarDays size={15}/>{new Intl.DateTimeFormat(lang==='km'?'km-KH':'en-US',{dateStyle:'full'}).format(currentTime)}</span><button className="icon-btn" onClick={toggleTheme} title={theme==='light'?t('darkMode'):t('lightMode')}>{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}</button><div className="relative lang-menu-wrap" ref={langMenuRef}><button type="button" className="lang-btn" aria-label={t('switchLanguage')} aria-haspopup="menu" aria-expanded={langOpen} onClick={()=>setLangOpen(open=>!open)}>{lang==='km'?'ខ្មែរ':'EN'} <ChevronDown size={14}/></button>{langOpen&&<div className="popover lang-menu" role="menu"><button type="button" role="menuitemradio" aria-checked={lang==='km'} className={`lang-option ${lang==='km'?'active':''}`} onClick={()=>changeLanguage('km')}><span>ខ្មែរ</span>{lang==='km'&&<Check size={14}/>}</button><button type="button" role="menuitemradio" aria-checked={lang==='en'} className={`lang-option ${lang==='en'?'active':''}`} onClick={()=>changeLanguage('en')}><span>English</span>{lang==='en'&&<Check size={14}/>}</button></div>}</div><div className="relative"><button className="icon-btn notification-btn" aria-label={t('notifications')} onClick={()=>setNotice(current=>!current)}><Bell size={18}/><i/></button>{notice&&<NotificationDropdown role={user.role} onClose={()=>setNotice(false)} t={t}/>}</div><div className="top-user"><div className={`avatar ${user.role}`}>{user.name[0]}</div><span><b>{user.name}</b><small>{t(user.role)}</small></span></div></div></header>
   <div className="page-content"><Outlet context={{user}}/></div>
  </main>
  {supportOpen&&<div className="modal-backdrop" onClick={()=>setSupportOpen(false)}><section className="modal support-dialog" role="dialog" aria-modal="true" onClick={event=>event.stopPropagation()}><button type="button" className="icon-btn confirm-close" aria-label={t('close')} onClick={()=>setSupportOpen(false)}><X size={18}/></button><div className="login-icon"><Shield size={20}/></div><h2>{t('contactSupport')}</h2><p>{t('supportDescription')}</p><div className="modal-actions"><button className="button primary" onClick={()=>setSupportOpen(false)}>{t('close')}</button></div></section></div>}
  {logoutOpen&&<ConfirmDialog title={t('logoutConfirmTitle')} description={t('logoutConfirmDescription')} confirmLabel={t('logout')} cancelLabel={t('cancel')} onConfirm={logout} onCancel={()=>setLogoutOpen(false)}/>}
 </div>
}
