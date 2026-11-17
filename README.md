# School Management System (SMS)

A complete, responsive frontend for a school management portal built with **React (Vite), JavaScript, Tailwind CSS v4, React Router, Axios, React Hook Form, Recharts, i18next and Lucide React**.

The app ships with realistic local demo data and a clean service boundary so it can be connected to a **Laravel REST API (Sanctum)** without rewriting pages.

---

## Quick start

```sh
npm install
cp .env.example .env
npm run dev
```

Open the URL printed by Vite. Demo accounts are one click away on the login page.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Static checks |
| `npm test` | Service/data tests |

---

## Demo accounts

| Role | Name | One-click login |
| --- | --- | --- |
| Admin (នាយកសាលា) | Sophea Chan | Admin demo button |
| Teacher (គ្រូបង្រៀន) | Dara Sok | Teacher demo button |
| Student (សិស្ស) | Sokha Lim | Student demo button |

You can also register a local account and sign in with email/password. Passwords are salted and hashed with PBKDF2 in the browser. **Never use a real password** in demo mode.

> Frontend role checks only control what is visible. Real authorization must be enforced by the Laravel backend.

---

## Features

### Shared
- Khmer (default) / English switching, persisted in `localStorage`
- Khmer-compatible **Battambang** font; Inter for English
- Light / dark theme, persisted in `localStorage`
- Responsive desktop sidebar + mobile drawer with breakpoints for 375 / 768 / 1024 / 1440 px
- Global toast notifications, confirmation dialogs, loading skeletons, empty and error states
- Print-friendly report and result layouts

### Admin
Dashboard with statistics, enrollment, gender, attendance and performance charts, recent students, activity, exams and notifications. Full management for students, teachers, classes, subjects, academic years, attendance, exams, grades, payments, schedules, users, reports, notifications and settings.

### Teacher
Role dashboard, assigned classes/students/subjects only, attendance recording for assigned classes, exam results with score entry (total, average, grade classification, pass/fail), schedule, notifications and profile.

### Student
Personal dashboard, profile, class, subjects, attendance, results/grades, schedule, payments and notifications — scoped to their own records.

---

## Architecture

```
src/
  api/            axios.js, endpoints.js, services/  -> Laravel REST layer
  assets/         images
  components/     common/, forms/, tables/, charts/, modals/, ui/
  constants/      permissions.js, moduleSchemas.js, moduleIdentity.js
  context/        AuthContext, PreferencesContext, ToastContext
  hooks/          useAuth, usePreferences, useResource, useDashboard, useToast
  layouts/        RoleLayout, AuthLayout
  locales/        km.json, en.json
  pages/          auth/, admin-shared modules, reports, settings
  routes/         AppRoutes, ProtectedRoute
  services/       mockService, dataService (adapter), authService, *Service.js
  utils/          grades.js, details.js
```

Data flow:

```
Pages -> Hooks (useResource / useDashboard) -> dataService
          -> mockService  (VITE_USE_MOCK_API=true, default)
          -> Axios API services (VITE_USE_MOCK_API=false) -> Laravel REST API
```

No page component calls Axios directly. Endpoint names, request headers, bearer token injection, error normalization and pagination parameters live in `src/api`.

### Switching to the real Laravel API

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL=http://127.0.0.1:8000/api`.
3. Set `VITE_USE_MOCK_API=false`.
4. Replace the demo auth implementation in `src/services/authService.js` with `src/api/services/authApi.js` (Sanctum login, `/user`, token storage).
5. Keep the returned field names (`student_id`, `teacher_id`, `class_id`, …) or map them inside the service layer.

The mock and real paths are selected in one place — `src/services/dataService.js` — so UI code is unchanged.

---

## Notes

- All demo records are stored in `localStorage` (`sms-demo-records-v1`) so CRUD changes survive reloads. Clear site data to reset the demo.
- Data naming follows the future Laravel backend (`student_id`, `teacher_id`, `class_id`, `subject_id`, `academic_year_id`, `attendance_id`, `exam_id`, `result_id`).
- Reports, charts and sample data are for interface demonstration only; no real backend response shape is assumed.
