import { GraduationCap, Moon, Sun } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { usePreferences } from '../hooks/usePreferences.js'

export default function AuthLayout() {
  const { t, lang, setLang, theme, toggleTheme } = usePreferences()
  return (
    <main className="auth-page">
      <div className="auth-brand"><div className="brand-mark"><GraduationCap size={24} /></div><span><b>SMS</b><small>{t('schoolPortal')}</small></span></div>
      <div className="auth-quick-actions">
        <button className="lang-btn" aria-label={t('switchLanguage')} onClick={() => setLang(lang === 'km' ? 'en' : 'km')}>{lang === 'km' ? 'ខ្មែរ' : 'EN'}</button>
        <button className="icon-btn" aria-label={theme === 'light' ? t('darkMode') : t('lightMode')} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
      <Outlet />
      <footer className="auth-footer">SMS · {t('schoolPortal')}</footer>
    </main>
  )
}
