import { moduleIdentity } from '../constants/moduleIdentity.js'

/**
 * Frontend-only mock database.
 *
 * All demonstration data lives here (never inside page components), so a real
 * Laravel REST API can replace it by switching the resource service adapter.
 * The public function signatures are kept stable for the rest of the app.
 */

export const dashboardStats = {
  admin: [
    { label: 'totalStudents', value: '1,248', change: '+12.5%' },
    { label: 'totalTeachers', value: '86', change: '+4.2%', tone: 'purple' },
    { label: 'totalClasses', value: '32', change: '+2.1%', tone: 'amber' },
    { label: 'totalSubjects', value: '48', change: '+3.8%', tone: 'green' },
  ],
  teacher: [
    { label: 'myStudents', value: '128', change: '+4.2%' },
    { label: 'myClasses', value: '6', change: 'This term', tone: 'purple' },
    { label: 'subjects', value: '3', change: 'Assigned', tone: 'amber' },
    { label: 'attendanceRate', value: '96.4%', change: '+1.8%', tone: 'green' },
  ],
  student: [
    { label: 'myAttendance', value: '96.8%', change: '+1.2%' },
    { label: 'subjects', value: '8', change: 'This term', tone: 'purple' },
    { label: 'averageGrade', value: 'A−', change: '+0.4', tone: 'amber' },
    { label: 'upcomingExams', value: '3', change: 'Next 2 weeks', tone: 'green' },
  ],
}

export const enrollmentData = [
  { year: '2021', students: 680, new: 110 },
  { year: '2022', students: 790, new: 125 },
  { year: '2023', students: 900, new: 130 },
  { year: '2024', students: 1060, new: 152 },
  { year: '2025', students: 1248, new: 180 },
]

export const genderData = [
  { name: 'Male', value: 54 },
  { name: 'Female', value: 46 },
]

export const activityData = [
  { day: 'Mon', attendance: 93 },
  { day: 'Tue', attendance: 97 },
  { day: 'Wed', attendance: 94 },
  { day: 'Thu', attendance: 98 },
  { day: 'Fri', attendance: 92 },
]

const teacherAttendanceData = [
  { day: 'Mon', attendance: 95 },
  { day: 'Tue', attendance: 96 },
  { day: 'Wed', attendance: 97 },
  { day: 'Thu', attendance: 96 },
  { day: 'Fri', attendance: 98 },
]

const studentAttendanceData = [
  { day: 'Mon', attendance: 97 },
  { day: 'Tue', attendance: 98 },
  { day: 'Wed', attendance: 95 },
  { day: 'Thu', attendance: 99 },
  { day: 'Fri', attendance: 95 },
]

export const performanceData = [
  { subject: 'Mathematics', score: 86 },
  { subject: 'English', score: 82 },
  { subject: 'Physics', score: 78 },
  { subject: 'Chemistry', score: 84 },
  { subject: 'History', score: 88 },
  { subject: 'Khmer', score: 91 },
]

const student = (student_id, name, nameKh, gender, dateOfBirth, phone, address, parentName, parentPhone, clazz, enrollmentDate, status = 'Active') => ({
  student_id, name, nameKh, gender, dateOfBirth, phone, address, parentName, parentPhone,
  class: clazz, class_id: `CLS-${clazz.replace('Grade ', '')}`, profileImage: '', enrollmentDate, status,
})

const SOKHA = student('STU-2025-001', 'Sokha Lim', 'លីម សុខា', 'Female', '2011-04-18', '+855 12 555 222', 'Phnom Penh, Cambodia', 'Lim Vannak', '+855 12 555 100', 'Grade 8A', '2025-05-12')

export const moduleRecords = {
  students: [
    SOKHA,
    student('STU-2025-002', 'Dara Vann', 'វ៉ាន់ ដារ៉ា', 'Male', '2010-08-02', '+855 17 222 110', 'Phnom Penh, Cambodia', 'Vann Sokun', '+855 17 222 101', 'Grade 9B', '2025-05-11'),
    student('STU-2025-003', 'Khemara Lim', 'លឹម ខេមរា', 'Male', '2012-01-25', '+855 10 543 210', 'Kandal, Cambodia', 'Lim Srey', '+855 10 543 211', 'Grade 7A', '2025-05-10'),
    student('STU-2025-004', 'Sreypov Heng', 'ហេង ស្រីពៅ', 'Female', '2009-11-14', '+855 98 765 432', 'Phnom Penh, Cambodia', 'Heng Chanthol', '+855 98 765 433', 'Grade 10A', '2025-05-09', 'Pending'),
    student('STU-2025-005', 'Vicheka Ros', 'រុស្ស៊ី វិច្ឆេកា', 'Male', '2011-06-30', '+855 15 333 222', 'Phnom Penh, Cambodia', 'Ros Dara', '+855 15 333 223', 'Grade 8B', '2025-05-08'),
    student('STU-2025-006', 'Malis Chea', 'ជា ម៉ាលីស', 'Female', '2010-03-09', '+855 11 876 543', 'Takeo, Cambodia', 'Chea Sophea', '+855 11 876 544', 'Grade 9A', '2025-05-07'),
    student('STU-2025-007', 'Sokun Piseth', 'ពិសេដ្ឋ សុគុន', 'Male', '2012-09-17', '+855 96 111 333', 'Phnom Penh, Cambodia', 'Piseth Chan', '+855 96 111 334', 'Grade 6A', '2025-05-06', 'Inactive'),
  ],
  teachers: [
    { teacher_id: 'TCH-001', name: 'Dara Sok', gender: 'Male', email: 'dara.sok@school.edu', phone: '+855 12 345 111', address: 'Phnom Penh, Cambodia', specialization: 'Mathematics', subject: 'Mathematics', class: 'Grade 8A, 9B', classAssignments: 'Grade 8A, Grade 9B', subjectAssignments: 'Mathematics, Physics', status: 'Active' },
    { teacher_id: 'TCH-002', name: 'Sreymom Chea', gender: 'Female', email: 'sreymom.chea@school.edu', phone: '+855 17 222 110', address: 'Phnom Penh, Cambodia', specialization: 'English', subject: 'English', class: 'Grade 7A, 8B', classAssignments: 'Grade 7A, Grade 8B', subjectAssignments: 'English', status: 'Active' },
    { teacher_id: 'TCH-003', name: 'Vannak Lim', gender: 'Male', email: 'vannak.lim@school.edu', phone: '+855 10 543 210', address: 'Kandal, Cambodia', specialization: 'Physics', subject: 'Physics', class: 'Grade 10A', classAssignments: 'Grade 10A', subjectAssignments: 'Physics, Chemistry', status: 'Active' },
  ],
  classes: [
    { class_id: 'CLS-08A', name: 'Grade 8A', grade: 'Grade 8', academicYear: '2025–2026', room: 'Room 204', teacherName: 'Dara Sok', students: '32 students', status: 'Active' },
    { class_id: 'CLS-09B', name: 'Grade 9B', grade: 'Grade 9', academicYear: '2025–2026', room: 'Room 301', teacherName: 'Dara Sok', students: '28 students', status: 'Active' },
    { class_id: 'CLS-07A', name: 'Grade 7A', grade: 'Grade 7', academicYear: '2025–2026', room: 'Room 102', teacherName: 'Sreymom Chea', students: '30 students', status: 'Active' },
    { class_id: 'CLS-10A', name: 'Grade 10A', grade: 'Grade 10', academicYear: '2025–2026', room: 'Room 405', teacherName: 'Vannak Lim', students: '26 students', status: 'Active' },
  ],
  subjects: [
    { subject_id: 'SUB-001', subjectCode: 'MTH-008', name: 'Mathematics', subjectKh: 'គណិតវិទ្យា', description: 'Algebra, geometry and problem solving.', grade: 'Grades 7–10', teacherName: 'Dara Sok', class: '8 classes', status: 'Active' },
    { subject_id: 'SUB-002', subjectCode: 'ENG-008', name: 'English', subjectKh: 'ភាសាអង់គ្លេស', description: 'Reading, writing and communication skills.', grade: 'Grades 6–10', teacherName: 'Sreymom Chea', class: '10 classes', status: 'Active' },
    { subject_id: 'SUB-003', subjectCode: 'PHY-010', name: 'Physics', subjectKh: 'រូបវិទ្យា', description: 'Mechanics, electricity and waves.', grade: 'Grades 9–10', teacherName: 'Dara Sok', class: '6 classes', status: 'Active' },
    { subject_id: 'SUB-004', subjectCode: 'KHM-008', name: 'Khmer', subjectKh: 'ភាសាខ្មែរ', description: 'Khmer literature and grammar.', grade: 'Grades 6–10', teacherName: 'Sreymom Chea', class: '9 classes', status: 'Active' },
  ],
  academicyears: [
    { academic_year_id: 'AY-2025', name: '2025–2026', startDate: '2025-09-01', endDate: '2026-07-31', isCurrent: 'Yes', status: 'Active' },
    { academic_year_id: 'AY-2024', name: '2024–2025', startDate: '2024-09-01', endDate: '2025-07-31', isCurrent: 'No', status: 'Inactive' },
  ],
  exams: [
    { exam_id: 'EXM-001', name: 'Midterm Examination', subject: 'Mathematics', class: 'Grade 8A', date: '2026-11-20', totalMarks: 100, status: 'Scheduled' },
    { exam_id: 'EXM-002', name: 'English Quiz', subject: 'English', class: 'Grade 9B', date: '2026-11-22', totalMarks: 50, status: 'Scheduled' },
    { exam_id: 'EXM-003', name: 'Physics Assessment', subject: 'Physics', class: 'Grade 10A', date: '2026-11-26', totalMarks: 100, status: 'Published' },
  ],
  grades: [
    { result_id: 'RES-001', student_id: 'STU-2025-001', name: 'Sokha Lim', class: 'Grade 8A', subject: 'Mathematics', examName: 'Midterm Examination', score: 88, totalMarks: 100, amount: '88 / 100', grade: 'A', status: 'Published' },
    { result_id: 'RES-002', student_id: 'STU-2025-002', name: 'Dara Vann', class: 'Grade 9B', subject: 'English', examName: 'English Quiz', score: 76, totalMarks: 100, amount: '76 / 100', grade: 'B', status: 'Published' },
    { result_id: 'RES-003', student_id: 'STU-2025-003', name: 'Khemara Lim', class: 'Grade 7A', subject: 'Khmer', examName: 'Midterm Examination', score: 92, totalMarks: 100, amount: '92 / 100', grade: 'A+', status: 'Published' },
    { result_id: 'RES-004', student_id: 'STU-2025-004', name: 'Sreypov Heng', class: 'Grade 10A', subject: 'Physics', examName: 'Physics Assessment', score: 64, totalMarks: 100, amount: '64 / 100', grade: 'C', status: 'Published' },
  ],
  payments: [
    { payment_id: 'INV-2025-001', student_id: 'STU-2025-001', name: 'Sokha Lim', class: 'Grade 8A', amount: '$120.00', date: '2026-11-12', paymentMethod: 'Cash', reference: 'PAY-1001', status: 'Paid' },
    { payment_id: 'INV-2025-002', student_id: 'STU-2025-002', name: 'Dara Vann', class: 'Grade 9B', amount: '$120.00', date: '2026-11-10', paymentMethod: 'Bank transfer', reference: 'PAY-1002', status: 'Unpaid' },
    { payment_id: 'INV-2025-003', student_id: 'STU-2025-003', name: 'Khemara Lim', class: 'Grade 7A', amount: '$120.00', date: '2026-11-08', paymentMethod: 'Cash', reference: 'PAY-1003', status: 'Partial' },
  ],
  attendance: [
    { attendance_id: 'ATT-001', student_id: 'STU-2025-001', name: 'Sokha Lim', class: 'Grade 8A', class_id: 'CLS-08A', date: '2026-11-16', status: 'Present' },
    { attendance_id: 'ATT-002', student_id: 'STU-2025-002', name: 'Dara Vann', class: 'Grade 9B', class_id: 'CLS-09B', date: '2026-11-16', status: 'Absent' },
    { attendance_id: 'ATT-003', student_id: 'STU-2025-003', name: 'Khemara Lim', class: 'Grade 7A', class_id: 'CLS-07A', date: '2026-11-15', status: 'Late' },
  ],
  notifications: [
    { notification_id: 'NTF-001', title: 'Midterm exam schedule', message: 'Grade 8A midterm examinations begin on 20 November.', date: '2026-11-16', type: 'exam', status: 'New' },
    { notification_id: 'NTF-002', title: 'Attendance report ready', message: 'The weekly attendance report is available to review.', date: '2026-11-15', type: 'attendance', status: 'New' },
    { notification_id: 'NTF-003', title: 'Fee payment reminder', message: 'Please complete outstanding fee payments before 30 November.', date: '2026-11-14', type: 'payment', status: 'Read' },
  ],
  schedules: [
    { schedule_id: 'SCH-001', date: '2026-11-20', startTime: '08:00', endTime: '09:00', class: 'Grade 8A', subject: 'Mathematics', teacherName: 'Dara Sok', status: 'Scheduled' },
    { schedule_id: 'SCH-002', date: '2026-11-20', startTime: '10:00', endTime: '11:00', class: 'Grade 9B', subject: 'English', teacherName: 'Sreymom Chea', status: 'Scheduled' },
  ],
  users: [
    { user_id: 'USR-001', name: 'Sophea Chan', email: 'admin@school.edu', phone: '+855 12 345 678', role: 'admin', status: 'Active' },
    { user_id: 'USR-002', name: 'Dara Sok', email: 'teacher@school.edu', phone: '+855 12 345 111', role: 'teacher', status: 'Active' },
    { user_id: 'USR-003', name: 'Sokha Lim', email: 'student@school.edu', phone: '+855 12 555 222', role: 'student', status: 'Active' },
  ],
  reports: [],
  settings: [],
}

moduleRecords.myclasses = moduleRecords.classes
moduleRecords.mystudents = moduleRecords.students
moduleRecords.myschedule = moduleRecords.schedules
moduleRecords.myattendance = moduleRecords.attendance
moduleRecords.myresults = moduleRecords.grades

const STORAGE_KEY = 'sms-demo-records-v1'
function readStore() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} } }
function saveStore(store) { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) }
const storeKey = (module, role) => (module === 'profile' ? `${module}:${role}` : module)
const dataRole = (module, role) => (module === 'profile' ? role : 'admin')

export { moduleIdentity }

const ROLE_FILTERS = {
  student: {
    payments: (row) => row.name === 'Sokha Lim',
    students: (row) => row.student_id === 'STU-2025-001',
    myclasses: (row) => row.name === 'Grade 8A',
    subjects: (row) => String(row.grade || '').includes('8'),
    grades: (row) => row.class === 'Grade 8A',
    myresults: (row) => row.class === 'Grade 8A',
    attendance: (row) => row.class === 'Grade 8A',
    myattendance: (row) => row.class === 'Grade 8A',
    schedules: (row) => row.class === 'Grade 8A',
    myschedule: (row) => row.class === 'Grade 8A',
  },
  teacher: {
    students: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
    mystudents: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
    subjects: (row) => row.teacherName === 'Dara Sok',
    grades: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
    exams: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
    attendance: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
    schedules: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
    myschedule: (row) => ['Grade 8A', 'Grade 9B'].includes(row.class),
  },
}

export function getModuleRecords(module, role = 'admin') {
  if (module === 'mystudents' && role === 'teacher') return getModuleRecords('students', role)
  const store = readStore()
  const key = storeKey(module, role)
  const source = store[key] || moduleRecords[module] || []
  const idKey = moduleIdentity[module] || 'record_id'
  let rows = source.map((row, index) => (row[idKey] ? row : { ...row, [idKey]: `${module}-${role}-${index + 1}` }))

  if (module === 'profile' && !store[key]) {
    if (role === 'student') return [{ record_id: 'profile-student', name: 'Sokha Lim', subject: 'Grade 8A student', phone: '+855 12 555 222', email: 'sokha.lim@student.edu', status: 'Active' }]
    if (role === 'teacher') return [{ record_id: 'profile-teacher', name: 'Dara Sok', subject: 'Mathematics teacher', phone: '+855 12 345 111', email: 'dara.sok@school.edu', status: 'Active' }]
  }

  const filter = ROLE_FILTERS[role]?.[module]
  if (filter) rows = rows.filter(filter)
  return rows
}

export function saveModuleRecords(module, rows) {
  const store = readStore()
  store[module] = rows
  saveStore(store)
  return rows
}

export function createModuleRecord(module, values, role = 'admin') {
  const scope = dataRole(module, role)
  const rows = getModuleRecords(module, scope)
  const idKey = moduleIdentity[module] || 'record_id'
  const row = { ...values, [idKey]: values[idKey] || `SMS-${Date.now()}` }
  const store = readStore()
  store[storeKey(module, scope)] = [row, ...rows]
  saveStore(store)
  return row
}

export function updateModuleRecord(module, idKey, id, values, role = 'admin') {
  const scope = dataRole(module, role)
  const rows = getModuleRecords(module, scope).map((row) => (row[idKey] === id ? { ...row, ...values } : row))
  const store = readStore()
  store[storeKey(module, scope)] = rows
  saveStore(store)
  return rows
}

export function deleteModuleRecord(module, idKey, id, role = 'admin') {
  const scope = dataRole(module, role)
  const rows = getModuleRecords(module, scope).filter((row) => row[idKey] !== id)
  const store = readStore()
  store[storeKey(module, scope)] = rows
  saveStore(store)
  return rows
}

/** Helpers used by reports and specialized pages. Data stays in the service layer. */
export function getStudentsByClass(className) {
  return getModuleRecords('students').filter((row) => row.class === className)
}
export function getSubjectsByTeacher(teacherName) {
  return getModuleRecords('subjects').filter((row) => row.teacherName === teacherName)
}
export function getPerformance() { return performanceData }
export function getRecentNotifications(limit = 4) { return getModuleRecords('notifications').slice(0, limit) }

export const getDashboardData = (role = 'admin') => ({
  students: getModuleRecords('students', role),
  classes: getModuleRecords('myclasses', role),
  schedule: getModuleRecords(role === 'admin' ? 'schedules' : 'myschedule', role),
  payments: getModuleRecords('payments', role),
  grades: getModuleRecords('grades', role),
  notifications: getRecentNotifications(),
  stats: dashboardStats,
  enrollment: enrollmentData,
  gender: genderData,
  performance: performanceData,
  attendance: role === 'teacher' ? teacherAttendanceData : role === 'student' ? studentAttendanceData : activityData,
  attendanceAverage: role === 'teacher' ? '96.4%' : role === 'student' ? '96.8%' : '94.8%',
  activities: [
    { type: 'student', title: 'activityNewStudent', description: 'activityStudentJoined', time: 'minutesAgo' },
    { type: 'payment', title: 'activityPaymentReceived', description: 'activityPaymentDescription', time: 'hourAgo' },
    { type: 'exam', title: 'activityResultsPublished', description: 'activityResultsDescription', time: 'hoursAgo' },
  ],
  exams: [
    { month: 'NOV', day: '20', name: 'Mathematics', description: 'examGrade9Time' },
    { month: 'NOV', day: '22', name: 'English Language', description: 'examGrade8Time' },
    { month: 'NOV', day: '26', name: 'Physics', description: 'examGrade10Time' },
  ],
})
