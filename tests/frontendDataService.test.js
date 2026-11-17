import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { dataService } from '../src/services/dataService.js'
import { classifyScore } from '../src/utils/grades.js'
import { buildDetailSections } from '../src/utils/details.js'
import { getModuleRecords } from '../src/services/mockService.js'

function createStorage() {
  return { values: new Map(), getItem(key) { return this.values.get(key) ?? null }, setItem(key, value) { this.values.set(key, String(value)) }, removeItem(key) { this.values.delete(key) } }
}
globalThis.localStorage = createStorage()
globalThis.sessionStorage = createStorage()

beforeEach(() => { localStorage.values.clear(); sessionStorage.values.clear() })

test('dataService uses mock mode by default and performs full CRUD', async () => {
  assert.equal(dataService.USE_MOCK_API ?? true, true)
  const created = await dataService.create('students', { name: 'Test Student', class: 'Grade 8A', status: 'Active' })
  assert.ok(created.student_id)
  const list = await dataService.list('students')
  assert.ok(list.some((row) => row.student_id === created.student_id))
  await dataService.update('students', created.student_id, { status: 'Inactive' })
  assert.equal((await dataService.list('students')).find((row) => row.student_id === created.student_id).status, 'Inactive')
  await dataService.remove('students', created.student_id)
  assert.equal((await dataService.list('students')).some((row) => row.student_id === created.student_id), false)
})

test('student role records remain scoped through the adapter', async () => {
  const rows = await dataService.list('payments', 'student')
  assert.ok(rows.length > 0)
  assert.ok(rows.every((row) => row.name === 'Sokha Lim'))
})

test('grade classification computes average, grade and pass/fail', () => {
  assert.deepEqual(
    { grade: classifyScore(92, 100).grade, status: classifyScore(92, 100).status },
    { grade: 'A+', status: 'Pass' },
  )
  assert.equal(classifyScore(42, 100).status, 'Fail')
  assert.equal(classifyScore(75, 100).percentage, 75)
})

test('detail sections use translated labels and include class roster', () => {
  const t = (key) => key
  const row = getModuleRecords('classes')[0]
  const sections = buildDetailSections('classes', row, t)
  assert.ok(sections.some((section) => section.title === 'studentsInClass' && section.fields.length > 0))
})
