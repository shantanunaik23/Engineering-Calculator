// Calculator module: validates inputs against a formula schema and evaluates the expression
// Exposed API:
// - calculate(formula, inputs) -> number
// - validateAndPrepare(formula, inputs) -> normalized inputs or throws

function validateInputs(formula, rawInputs) {
  const out = {}
  const defs = Array.isArray(formula.inputs) ? formula.inputs : []
  for (const inDef of defs) {
    const name = inDef.name
    const value = rawInputs[name]
    // required by default unless explicitly false
    if (inDef.required === false) {
      // optional
    } else {
      if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required input: ${name}`)
      }
    }
    // Coerce to number if provided
    const num = Number(value)
    if (value !== undefined && value !== null && value !== '' && Number.isNaN(num)) {
      throw new Error(`Invalid number for input '${name}': ${value}`)
    }
    out[name] = Number.isNaN(num) ? 0 : num
  }
  return out
}

function evaluateExpression(expression, inputs) {
  const func = new Function('inputs', `with(inputs) { return (${expression}) }`)
  return func(inputs)
}

function calculate(formula, rawInputs) {
  if (!formula || typeof formula.expression !== 'string') {
    throw new Error('Invalid formula')
  }
  const prepared = validateInputs(formula, rawInputs || {})
  // allow Math.* as standard globals; expression may reference inputs by name
  const result = evaluateExpression(formula.expression, prepared)
  if (typeof result === 'number' && Number.isNaN(result)) {
    throw new Error('Calculation produced NaN')
  }
  return result
}

module.exports = { calculate, validateInputs }
