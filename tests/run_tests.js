// Lightweight tests for the calculator module
const assert = require('assert')
const calc = require('../calculator')
const fs = require('fs')
let formulas = []
try {
  formulas = JSON.parse(fs.readFileSync('../formulas.json','utf8'))
} catch (e) {
  formulas = []
}

function testRectArea(){
  const f = formulas.find(x => x.id === 'rect_area')
  if(!f) throw new Error('rect_area formula not found')
  const res = calc.calculate(f, { width: 3, height: 4 })
  assert.strictEqual(res, 12, 'Rectangle area should be 12')
}

function testCircleArea(){
  const f = formulas.find(x => x.id === 'circle_area')
  if(!f) throw new Error('circle_area formula not found')
  const res = calc.calculate(f, { radius: 1 })
  // Expect ~3.14159
  const diff = Math.abs(res - Math.PI)
  assert.ok(diff < 1e-6, `Circle area should be PI, got ${res}`)
}

try {
  testRectArea()
  console.log('[OK] rect_area')
  testCircleArea()
  console.log('[OK] circle_area')
  console.log('All tests passed')
} catch (err) {
  console.error('[FAILED]', err.message)
  process.exit(1)
}
