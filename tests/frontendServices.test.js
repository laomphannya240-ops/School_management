import test,{beforeEach} from 'node:test'
import assert from 'node:assert/strict'
import {webcrypto} from 'node:crypto'
import {authService} from '../src/services/authService.js'
import {createModuleRecord,deleteModuleRecord,getDashboardData,getModuleRecords,saveModuleRecords,updateModuleRecord} from '../src/services/mockService.js'
import {canAccessModule,roleModules} from '../src/constants/permissions.js'

function createStorage(){return {values:new Map(),getItem(key){return this.values.get(key)??null},setItem(key,value){this.values.set(key,String(value))},removeItem(key){this.values.delete(key)}}}
globalThis.crypto??=webcrypto
globalThis.localStorage=createStorage()
globalThis.sessionStorage=createStorage()

beforeEach(()=>{localStorage.values.clear();sessionStorage.values.clear()})

test('register hashes the password and logs the new user in',async()=>{
 const user=await authService.register({name:'Demo User',email:'DEMO@example.com',phone:'01234567',password:'SchoolDemo123!',role:'teacher'})
 assert.equal(user.email,'demo@example.com')
 assert.equal(authService.current().id,user.id)
 assert.equal(localStorage.getItem('sms-demo-users-v1').includes('SchoolDemo123!'),false)
})

test('login checks credentials and respects remember-me storage',async()=>{
 await authService.register({name:'Demo User',email:'demo@example.com',phone:'01234567',password:'SchoolDemo123!',role:'student'})
 authService.logout()
 const user=await authService.login('demo@example.com','SchoolDemo123!',false)
 assert.equal(user.role,'student')
 assert.equal(localStorage.getItem('sms-user'),null)
 assert.equal(sessionStorage.getItem('sms-user')!==null,true)
 await assert.rejects(authService.login('demo@example.com','wrong-password'),/INVALID_CREDENTIALS/)
})

test('duplicate registration is rejected and logout clears both session stores',async()=>{
 const values={name:'Demo User',email:'demo@example.com',phone:'01234567',password:'SchoolDemo123!',role:'admin'}
 await authService.register(values)
 await assert.rejects(authService.register(values),/EMAIL_EXISTS/)
 authService.logout()
 assert.equal(authService.current(),null)
 assert.equal(localStorage.getItem('sms-user'),null)
 assert.equal(sessionStorage.getItem('sms-user'),null)
})

test('role menus and mock records keep role-specific access',()=>{
 assert.ok(roleModules.admin.includes('users'))
 assert.ok(roleModules.admin.includes('schedules'))
 assert.ok(roleModules.teacher.includes('mystudents'))
 assert.ok(roleModules.student.includes('payments'))
 assert.equal(canAccessModule('student','users'),false)
 assert.equal(canAccessModule('teacher','mystudents'),true)
 assert.equal(getModuleRecords('mystudents','teacher').length>0,true)
 assert.equal(getModuleRecords('payments','student').every(row=>row.name==='Sokha Lim'),true)
})

test('settings records support create, update, and delete',()=>{
 const record=createModuleRecord('settings',{name:'Test setting',subject:'Enabled',status:'Active'})
 assert.ok(getModuleRecords('settings').some(row=>row.record_id===record.record_id))
 updateModuleRecord('settings','record_id',record.record_id,{subject:'Disabled'})
 assert.ok(getModuleRecords('settings').some(row=>row.record_id===record.record_id&&row.subject==='Disabled'))
 deleteModuleRecord('settings','record_id',record.record_id)
 assert.equal(getModuleRecords('settings').some(row=>row.record_id===record.record_id),false)
})

test('teacher grade edits preserve records outside the teacher view',()=>{
 saveModuleRecords('grades',[{result_id:'grade-8',name:'Student A',class:'Grade 8A',amount:'88 / 100'},{result_id:'grade-9',name:'Student B',class:'Grade 9B',amount:'90 / 100'},{result_id:'grade-10',name:'Student C',class:'Grade 10A',amount:'92 / 100'}])
 updateModuleRecord('grades','result_id','grade-8',{amount:'91 / 100'},'teacher')
 assert.equal(getModuleRecords('grades','admin').length,3)
 assert.equal(getModuleRecords('grades','admin').find(row=>row.result_id==='grade-8').amount,'91 / 100')
})

test('role dashboards use role-specific classes, students, payments, and attendance',()=>{
 const admin=getDashboardData('admin')
 const teacher=getDashboardData('teacher')
 const student=getDashboardData('student')
 assert.ok(admin.enrollment.length>0)
 assert.ok(teacher.classes.length>0&&teacher.students.length>0)
 assert.ok(student.payments.length>0&&student.payments.every(row=>row.name==='Sokha Lim'))
 assert.notEqual(admin.attendanceAverage,teacher.attendanceAverage)
 assert.notEqual(teacher.attendanceAverage,student.attendanceAverage)
})
