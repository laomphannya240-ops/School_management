/** Primary-key field used by each module, shared by mock and API adapters. */
export const moduleIdentity = {
  students: 'student_id', teachers: 'teacher_id', classes: 'class_id', subjects: 'subject_id',
  academicyears: 'academic_year_id', exams: 'exam_id', grades: 'result_id', results: 'result_id',
  payments: 'payment_id', attendance: 'attendance_id', notifications: 'notification_id',
  schedules: 'schedule_id', users: 'user_id',
  myclasses: 'class_id', mystudents: 'student_id', myschedule: 'schedule_id',
  myattendance: 'attendance_id', myresults: 'result_id',
}
