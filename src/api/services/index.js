import { authApi } from './authApi.js'
import { academicYearService } from './academicYearService.js'
import { attendanceService } from './attendanceService.js'
import { classService } from './classService.js'
import { examService } from './examService.js'
import { gradeService } from './gradeService.js'
import { notificationService } from './notificationService.js'
import { paymentService } from './paymentService.js'
import { reportService } from './reportService.js'
import { scheduleService } from './scheduleService.js'
import { settingService } from './settingService.js'
import { studentService } from './studentService.js'
import { subjectService } from './subjectService.js'
import { teacherService } from './teacherService.js'
import { userService } from './userService.js'

export {
  authApi,
  academicYearService,
  attendanceService,
  classService,
  examService,
  gradeService,
  notificationService,
  paymentService,
  reportService,
  scheduleService,
  settingService,
  studentService,
  subjectService,
  teacherService,
  userService,
}

/** One resource object per module, shared by the data service adapter. */
export const apiResources = {
  students: studentService,
  teachers: teacherService,
  classes: classService,
  subjects: subjectService,
  academicyears: academicYearService,
  attendance: attendanceService,
  exams: examService,
  grades: gradeService,
  payments: paymentService,
  reports: reportService,
  notifications: notificationService,
  users: userService,
  schedules: scheduleService,
  settings: settingService,
}

/** Normalize role-scoped module names to the matching API resource. */
export function apiModuleName(module) {
  const aliases = {
    myclasses: 'classes', mystudents: 'students', myschedule: 'schedules',
    myattendance: 'attendance', myresults: 'grades',
  }
  return aliases[module] || module
}
