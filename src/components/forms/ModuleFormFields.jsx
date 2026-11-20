const GENDERS = ['Female', 'Male']
const ACCOUNT_ROLES = ['admin', 'teacher', 'student']
const STATUSES = ['Active', 'Inactive', 'Pending', 'Present', 'Absent', 'Late', 'Permission', 'Scheduled', 'Published']
const CLASSES = ['Grade 6A', 'Grade 7A', 'Grade 8A', 'Grade 8B', 'Grade 9A', 'Grade 9B', 'Grade 10A']

export default function ModuleFormFields({ fields, register, errors, t, editing }) {
  return (
    <div className="form-grid">
      {fields.map(({ key, type = 'text', required }) => (
        <label key={key}>
          {t(key) || key}
          {type === 'gender' ? (
            <select {...register(key, { required })}>
              <option value="">{t('selectGender')}</option>
              {GENDERS.map((value) => <option key={value} value={value}>{t(value)}</option>)}
            </select>
          ) : type === 'accountRole' ? (
            <select {...register(key, { required })}>
              {ACCOUNT_ROLES.map((value) => <option key={value} value={value}>{t(value)}</option>)}
            </select>
          ) : type === 'yesNo' ? (
            <select {...register(key, { required })} defaultValue={editing?.[key] || 'No'}>
              <option value="No">{t('no')}</option>
              <option value="Yes">{t('yes')}</option>
            </select>
          ) : ['status', 'paymentStatus', 'notificationStatus'].includes(type) ? (
            <select {...register(key, { required })} defaultValue={editing?.[key] || (type === 'paymentStatus' ? 'Unpaid' : type === 'notificationStatus' ? 'New' : 'Active')}>
              {(type === 'paymentStatus' ? ['Paid', 'Unpaid', 'Partial'] : type === 'notificationStatus' ? ['New', 'Read'] : STATUSES).map((value) => (
                <option key={value} value={value}>{t(value)}</option>
              ))}
            </select>
          ) : type === 'class' ? (
            <select {...register(key, { required })}>
              <option value="">{t('selectClass')}</option>
              {CLASSES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          ) : type === 'textarea' ? (
            <textarea {...register(key, { required })} />
          ) : (
            <input type={type} min={type === 'number' ? 0 : undefined} {...register(key, { required })} placeholder={`${t('enter')} ${t(key) || key}`} />
          )}
          {errors[key] && <small className="field-error">{t('required')}</small>}
        </label>
      ))}
    </div>
  )
}
