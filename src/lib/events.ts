type DataEvent = 'expenses' | 'budgets' | 'payment_methods' | 'categories'

const bus = new Map<DataEvent, Set<() => void>>()

export function onEvent(name: DataEvent, fn: () => void): () => void {
  if (!bus.has(name)) bus.set(name, new Set())
  bus.get(name)!.add(fn)
  return () => bus.get(name)?.delete(fn)
}

export function emitEvent(name: DataEvent) {
  bus.get(name)?.forEach(fn => fn())
}
