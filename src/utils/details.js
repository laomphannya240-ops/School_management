/** Build translation-aware detail sections for the generic details modal. */
export function buildDetailSections(module, row, t) {
  const present = (key) => Object.prototype.hasOwnProperty.call(row, key)
  const f = (key) => ({ label: t(key) || key, value: row[key] })

  if (module === 'students' || module === 'mystudents') {
    const groups = [
      [t('personalInfo'), ['student_id', 'name', 'nameKh', 'gender', 'dateOfBirth']],
      [t('contactInfo'), ['phone', 'address', 'parentName', 'parentPhone']],
      [t('academicInfo'), ['class', 'class_id', 'enrollmentDate', 'status']],
    ]
    return groups.map(([title, keys]) => ({ title, fields: keys.filter(present).map(f) })).filter((group) => group.fields.length)
  }

  if (module === 'teachers') {
    const groups = [
      [t('personalInfo'), ['teacher_id', 'name', 'gender', 'email', 'phone', 'address']],
      [t('academicInfo'), ['specialization', 'subject', 'classAssignments', 'subjectAssignments', 'status']],
    ]
    return groups.map(([title, keys]) => ({ title, fields: keys.filter(present).map(f) })).filter((group) => group.fields.length)
  }

  if (module === 'classes' || module === 'myclasses') {
    const roster = row.students || row.classRoster || ''
    const groups = [
      [t('academicInfo'), ['class_id', 'name', 'grade', 'academicYear', 'room', 'teacherName', 'students', 'status']],
      [t('studentsInClass'), []],
    ]
    const sections = groups.map(([title, keys]) => ({ title, fields: keys.filter(present).map(f) }))
    if (roster) sections[1].fields.push({ label: t('students'), value: roster })
    return sections.filter((section) => section.fields.length)
  }

  const keys = Object.keys(row).filter((key) => present(key))
  return [{ title: t('details'), fields: keys.map(f) }]
}
