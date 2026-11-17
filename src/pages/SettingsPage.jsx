import { Globe2, Moon, ShieldCheck, Sun, UserRound } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { usePreferences } from '../hooks/usePreferences.js'

export default function SettingsPage({ t }) {
  const { user } = useAuth()
  const { lang, setLang, theme, toggleTheme } = usePreferences()

  return (
    <>
      <PageHeader eyebrow={`${t('workspace')} / ${t('settings')}`} title={t('settings')} description={t('settingsDescription')} />
      <div className="settings-grid">
        <section className="card settings-card">
          <div className="settings-head"><span className="settings-icon"><Globe2 size={19} /></span><div><h3>{t('language')}</h3><p>{t('switchLanguage')}</p></div></div>
          <div className="choice-row">
            <button className={`choice ${lang === 'km' ? 'active' : ''}`} onClick={() => setLang('km')}>ខ្មែរ</button>
            <button className={`choice ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-head"><span className="settings-icon">{theme === 'light' ? <Sun size={19} /> : <Moon size={19} />}</span><div><h3>{t('appearance')}</h3><p>{t('theme')}</p></div></div>
          <div className="choice-row">
            <button className={`choice ${theme === 'light' ? 'active' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>{t('lightMode')}</button>
            <button className={`choice ${theme === 'dark' ? 'active' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>{t('darkMode')}</button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-head"><span className="settings-icon"><UserRound size={19} /></span><div><h3>{t('account')}</h3><p>{t('demoAccountLabel')}</p></div></div>
          <div className="detail-grid compact">
            <div className="detail-field"><span>{t('fullName')}</span><strong>{user?.name || '—'}</strong></div>
            <div className="detail-field"><span>{t('email')}</span><strong>{user?.email || '—'}</strong></div>
            <div className="detail-field"><span>{t('role')}</span><strong>{t(user?.role || '')}</strong></div>
            <div className="detail-field"><span>{t('phone')}</span><strong>{user?.phone || '—'}</strong></div>
          </div>
        </section>

        <section className="card settings-card security-note">
          <div className="settings-head"><span className="settings-icon warning"><ShieldCheck size={19} /></span><div><h3>{t('securityNotice').slice(0, 24)}…</h3></div></div>
          <p>{t('securityNotice')}</p>
        </section>
      </div>
    </>
  )
}
