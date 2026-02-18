// Lightweight API server for formula lookup and calculation
// Features:
// - Serve a small library of formulas from formulas.json
// - Evaluate a simple arithmetic expression for a given formula
// - Simple REST endpoints under /api
// - Static UI at /public (index.html)

const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static assets (UI)
app.use('/', express.static(path.join(__dirname, 'public')))

// Load formulas at startup (default catalog + user-defined store)
let formulas = []
const storePath = path.join(__dirname, 'store.json')
const formulasPath = path.join(__dirname, 'formulas.json')
function loadDefaults() {
  try {
    const data = fs.readFileSync(formulasPath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to load formulas.json:', err)
    return []
  }
}

function loadStore() {
  try {
    if (!fs.existsSync(storePath)) return []
    const data = fs.readFileSync(storePath, 'utf8')
    return JSON.parse(data) || []
  } catch (err) {
    console.error('Failed to load store.json:', err)
    return []
  }
}

function saveStore(userFormulas) {
  try {
    fs.writeFileSync(storePath, JSON.stringify(userFormulas, null, 2), 'utf8')
  } catch (e) {
    console.error('Failed to save store.json:', e)
  }
}

const defaults = loadDefaults()
const storeFormulas = loadStore()
// Merge, user formulas (store) take precedence on id collision
const byId = new Map()
defaults.forEach(f => byId.set(f.id, f))
storeFormulas.forEach(f => byId.set(f.id, f))
formulas = Array.from(byId.values())


// API: get formulas
app.get('/api/formulas', (req, res) => {
  res.json({ formulas })
})

// Simple calculator using a shared module (to be added) or inline logic
const calculator = require('./calculator')

// API: calculate a formula using provided inputs
app.post('/api/calculate', (req, res) => {
  const { formula_id, inputs } = req.body || {}
  if (!formula_id || typeof inputs !== 'object') {
    return res.status(400).json({ error: 'Invalid request: formula_id and inputs are required' })
  }

  const formula = formulas.find((f) => f.id === formula_id)
  if (!formula) {
    return res.status(404).json({ error: 'Formula not found' })
  }

  try {
    const result = calculator.calculate(formula, inputs)
    res.json({ id: formula.id, name: formula.name, result, inputs, expression: formula.expression })
  } catch (e) {
    res.status(500).json({ error: 'Calculation error', details: e.message })
  }
})

// API: add or update a user formula in the local store
app.post('/api/formulas', (req, res) => {
  const f = req.body
  if (!f || !f.id || !f.name || !f.expression) {
    return res.status(400).json({ error: 'Invalid formula payload. Required: id, name, expression' })
  }
  // Load current user formulas from store (read fresh to avoid race in simple setup)
  let userFormulas = []
  try {
    if (fs.existsSync(storePath)) {
      const data = fs.readFileSync(storePath, 'utf8')
      userFormulas = JSON.parse(data) || []
    }
  } catch (e) {
    console.error('Error reading store.json:', e)
  }
  const idx = userFormulas.findIndex((x) => x.id === f.id)
  if (idx >= 0) userFormulas[idx] = f
  else userFormulas.push(f)
  saveStore(userFormulas)
  // Rebuild in-memory formulas (defaults + user formulas)
  const merged = new Map()
  defaults.forEach(ff => merged.set(ff.id, ff))
  userFormulas.forEach(ff => merged.set(ff.id, ff))
  formulas = Array.from(merged.values())
  res.json({ ok: true, formula: f, count: formulas.length })
})

// API: simple AI-workflow stub for a given formula
app.get('/api/workflow/:id', (req, res) => {
  const fid = req.params.id
  const f = formulas.find((x) => x.id === fid)
  if (!f) return res.status(404).json({ error: 'Formula not found' })
  const workflow = {
    formulaId: fid,
    name: f.name,
    steps: [
      { idx: 1, name: 'Gather inputs', description: 'Collect required inputs for the formula' },
      { idx: 2, name: 'Validate inputs', description: 'Ensure inputs meet required types/ranges' },
      { idx: 3, name: 'Compute', description: 'Evaluate the expression' },
      { idx: 4, name: 'Format result', description: 'Present in a readable format' },
      { idx: 5, name: 'Export', description: 'Optionally export results as TXT/CSV' }
    ]
  }
  res.json(workflow)
})

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`Engineering Calculator API running on http://localhost:${PORT}`)
})
