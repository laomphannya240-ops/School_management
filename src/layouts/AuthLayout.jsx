import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, GraduationCap, Moon, Sun } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { usePreferences } from '../hooks/usePreferences.js'

export default function AuthLayout() {
  const { t, lang, setLang, theme, toggleTheme } = usePreferences()
  const [langOpen, setLangOpen] = useState(false)
  const langMenuRef = useRef(null)

  useEffect(() => {
    if (!langOpen) return undefined
    const onPointerDown = (event) => { if (langMenuRef.current && !langMenuRef.current.contains(event.target)) setLangOpen(false) }
    const onKeyDown = (event) => { if (event.key === 'Escape') setLangOpen(false) }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [langOpen])

  const changeLanguage = (next) => {
    setLang(next)
    setLangOpen(false)
  }

  return (
    <main className="auth-page">
      <div className="auth-brand"><div className="brand-mark"><GraduationCap size={24} /></div><span><b>SMS</b><small>{t('schoolPortal')}</small></span></div>
      <div className="auth-quick-actions">
        <div className="relative lang-menu-wrap" ref={langMenuRef}>
          <button type="button" className="lang-btn" aria-label={t('switchLanguage')} aria-haspopup="menu" aria-expanded={langOpen} onClick={() => setLangOpen((open) => !open)}>
            {lang === 'km' ? 'ខ្មែរ' : 'EN'} <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div className="popover lang-menu" role="menu">
              <button type="button" role="menuitemradio" aria-checked={lang === 'km'} className={`lang-option ${lang === 'km' ? 'active' : ''}`} onClick={() => changeLanguage('km')}>
                <span>ខ្មែរ</span>{lang === 'km' && <Check size={14} />}
              </button>
              <button type="button" role="menuitemradio" aria-checked={lang === 'en'} className={`lang-option ${lang === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>
                <span>English</span>{lang === 'en' && <Check size={14} />}
              </button>
            </div>
          )}
        </div>
        <button className="icon-btn" aria-label={theme === 'light' ? t('darkMode') : t('lightMode')} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
      <Outlet />
      <footer className="auth-footer">SMS · {t('schoolPortal')}</footer>
    </main>
  )
}
