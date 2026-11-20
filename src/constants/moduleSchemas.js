const field = (key, type = 'text', required = false) => ({ key, type, required })

export const moduleSchemas = {
  students: {
    columns: ['student_id', 'name', 'gender', 'class', 'phone', 'status'],
    fields: [
      field('fullNameKh'), field('name', 'text', true), field('gender', 'gender', true),
      field('dateOfBirth', 'date'), field('phone', 'tel'), field('address'),
      field('parentName'), field('parentPhone', 'tel'), field('class', 'class', true),
      field('profileImage', 'url'), field('enrollmentDate', 'date'), field('status', 'status', true),
    ],
  },
  teachers: {
    columns: ['teacher_id', 'name', 'gender', 'email', 'phone', 'subject', 'class', 'status'],
    fields: [
      field('name', 'text', true), field('gender', 'gender', true), field('email', 'email'),
      field('phone', 'tel'), field('address'), field('specialization'),
      field('classAssignments'), field('subjectAssignments'), field('status', 'status', true),
    ],
  },
  classes: {
    columns: ['class_id', 'name', 'grade', 'academicYear', 'room', 'teacherName', 'students', 'status'],
    fields: [
      field('name', 'text', true), field('grade', 'text', true), field('academicYear'),
      field('room'), field('homeroomTeacher'), field('students'), field('status', 'status', true),
    ],
  },
  subjects: {
    columns: ['subject_id', 'subjectCode', 'name', 'subjectKh', 'grade', 'teacherName', 'class', 'status'],
    fields: [
      field('subjectCode', 'text', true), field('name', 'text', true), field('subjectKh'),
      field('description', 'textarea'), field('grade'), field('teacherName'),
      field('classAssignments'), field('status', 'status', true),
    ],
  },
  academicyears: {
    columns: ['academic_year_id', 'name', 'startDate', 'endDate', 'isCurrent', 'status'],
    fields: [
      field('name', 'text', true), field('startDate', 'date', true), field('endDate', 'date', true),
      field('isCurrent', 'yesNo'), field('status', 'status', true),
    ],
  },
  exams: {
    columns: ['exam_id', 'name', 'subject', 'class', 'date', 'totalMarks', 'status'],
    fields: [
      field('name', 'text', true), field('subject', 'text', true), field('class', 'class', true),
      field('date', 'date', true), field('startTime', 'time'), field('totalMarks', 'number'),
      field('status', 'status', true),
    ],
  },
  grades: {
    columns: ['name', 'class', 'subject', 'amount', 'grade', 'status'],
    fields: [
      field('studentName', 'text', true), field('class', 'text', true), field('subject', 'text', true),
      field('examName'), field('score', 'number', true), field('totalMarks', 'number', true),
      field('grade'), field('status', 'status', true),
    ],
  },
  payments: {
    columns: ['payment_id', 'name', 'class', 'amount', 'date', 'paymentMethod', 'status'],
    fields: [
      field('name', 'text', true), field('class', 'text', true), field('amount', 'number', true),
      field('date', 'date', true), field('paymentMethod'), field('reference'),
      field('status', 'paymentStatus', true),
    ],
  },
  reports: { columns: ['name', 'class', 'date', 'status'], fields: [] },
  notifications: {
    columns: ['title', 'message', 'date', 'status'],
    fields: [field('date', 'date', true), field('title', 'text', true), field('message', 'textarea', true), field('status', 'notificationStatus', true)],
  },
  settings: { columns: ['name', 'subject', 'status'], fields: [field('name', 'text', true), field('subject', 'text', true), field('status', 'status', true)] },
  schedules: {
    columns: ['schedule_id', 'date', 'startTime', 'endTime', 'class', 'subject', 'teacherName', 'status'],
    fields: [
      field('date', 'date', true), field('startTime', 'time', true), field('endTime', 'time', true),
      field('class', 'class', true), field('subject', 'text', true), field('teacherName', 'text', true),
      field('status', 'status', true),
    ],
  },
  users: {
    columns: ['user_id', 'name', 'email', 'phone', 'role', 'status'],
    fields: [field('name', 'text', true), field('email', 'email', true), field('phone', 'tel'), field('role', 'accountRole', true), field('status', 'status', true)],
  },
  myclasses: { columns: ['class_id', 'name', 'grade', 'room', 'teacherName', 'status'], fields: [] },
  mystudents: { columns: ['student_id', 'name', 'gender', 'class', 'phone', 'status'], fields: [] },
  myschedule: { columns: ['schedule_id', 'date', 'startTime', 'endTime', 'class', 'subject', 'status'], fields: [] },
  myattendance: { columns: ['attendance_id', 'date', 'name', 'class', 'status'], fields: [] },
  myresults: { columns: ['result_id', 'name', 'class', 'subject', 'amount', 'grade', 'status'], fields: [] },
  buildings: {
    columns: ['code', 'name', 'numberOfFloors', 'status', 'description'],
    fields: [
      field('name', 'text', true), field('code', 'text', true), field('numberOfFloors', 'number', true),
      field('description', 'textarea'), field('status', 'status', true),
    ],
  },
  floors: {
    columns: ['buildingName', 'floor_number', 'name', 'status', 'description'],
    fields: [
      field('building_id', 'text', true), field('name', 'text', true), field('floor_number', 'number', true),
      field('description', 'textarea'), field('status', 'status', true),
    ],
  },
  rooms: {
    columns: ['code', 'name', 'buildingName', 'floorName', 'room_type', 'capacity', 'status'],
    fields: [
      field('name', 'text', true), field('code', 'text', true), field('building_id', 'text', true),
      field('floor_id', 'text', true), field('room_type', 'text', true), field('capacity', 'number', true),
      field('description', 'textarea'), field('status', 'status', true),
    ],
  },
  'room-assignments': {
    columns: ['className', 'buildingName', 'floorName', 'roomName', 'academicYear', 'start_date', 'end_date'],
    fields: [
      field('class_id', 'text', true), field('building_id', 'text', true), field('floor_id', 'text', true),
      field('room_id', 'text', true), field('academic_year_id', 'text', true),
      field('start_date', 'date', true), field('end_date', 'date'),
    ],
  },
  profile: { columns: ['name', 'subject', 'phone', 'email', 'status'], fields: [field('name', 'text', true), field('subject'), field('phone', 'tel'), field('email', 'email')] },
}
