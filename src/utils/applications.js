const KEY = 'connectgrad_applications'

export function getApplications() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function addApplications(jobs) {
  const existing = getApplications()
  const existingIds = new Set(existing.map(a => a.id))
  const newApps = jobs
    .filter(j => !existingIds.has(j.id))
    .map(j => ({ ...j, status: 'Applied', appliedAt: new Date().toISOString() }))
  localStorage.setItem(KEY, JSON.stringify([...existing, ...newApps]))
  return { added: newApps.length, duplicate: jobs.length - newApps.length }
}

export function updateStatus(id, status) {
  const updated = getApplications().map(a => a.id === id ? { ...a, status } : a)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function removeApplication(id) {
  const updated = getApplications().filter(a => a.id !== id)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}
