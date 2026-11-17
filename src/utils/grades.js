/** Grade classification shared by score entry, results and reports. */
export function classifyScore(score, totalMarks = 100) {
  const numericScore = Number(score)
  const numericTotal = Number(totalMarks) || 100
  const percentage = Math.round((numericScore / numericTotal) * 1000) / 10
  let grade = 'F'
  if (percentage >= 90) grade = 'A+'
  else if (percentage >= 80) grade = 'A'
  else if (percentage >= 70) grade = 'B'
  else if (percentage >= 60) grade = 'C'
  else if (percentage >= 50) grade = 'D'
  return {
    score: numericScore,
    totalMarks: numericTotal,
    percentage,
    grade,
    status: percentage >= 50 ? 'Pass' : 'Fail',
    average: numericScore,
  }
}
