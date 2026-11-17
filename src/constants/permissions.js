/**
 * UI navigation permissions only.
 * These NEVER replace backend authorization; Laravel Sanctum policies must
 * enforce the real access rules once the API is connected.
 */
export const roleModules = {
  admin: [
    'dashboard', 'students', 'teachers', 'classes', 'subjects', 'academicyears',
    'attendance', 'exams', 'grades', 'schedules', 'payments', 'users', 'reports',
    'notifications', 'settings',
  ],
  teacher: [
    'dashboard', 'myclasses', 'mystudents', 'subjects', 'attendance', 'exams',
    'grades', 'myschedule', 'notifications', 'profile',
  ],
  student: [
    'dashboard', 'profile', 'myclasses', 'subjects', 'myattendance', 'grades',
    'myschedule', 'payments', 'notifications',
  ],
}

export function canAccessModule(role, module) {
  return module === 'dashboard' || Boolean(roleModules[role]?.includes(module))
}
