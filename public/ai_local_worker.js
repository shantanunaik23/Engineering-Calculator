// Lightweight in-browser AI worker (pseudo-local AI)
// This simulates a local AI workflow generator without relying on external models.
// It runs in a Web Worker to avoid blocking the UI thread.

self.onmessage = function(event) {
  const data = event.data || {}
  if (data.type === 'generate-workflow') {
    const formula = data.formula
    const inputs = data.inputs || {}
    // Build a simple heuristic workflow based on the formula
    const steps = []
    steps.push({ idx: 1, name: 'Identify inputs', description: `Inputs: ${ (formula.inputs || []).map(i => i.name).join(', ') }` })
    steps.push({ idx: 2, name: 'Validate inputs', description: 'Check presence and numeric types' })
    steps.push({ idx: 3, name: 'Prepare calculation', description: 'Map inputs to formula variables' })
    steps.push({ idx: 4, name: 'Compute', description: `Evaluate: ${formula.expression}` })
    steps.push({ idx: 5, name: 'Wrap up', description: 'Return structured result' })
    const workflow = {
      formulaId: formula.id,
      name: formula.name,
      inputs: inputs,
      steps: steps
    }
    self.postMessage({ type: 'workflow', workflow: workflow })
  }
}
