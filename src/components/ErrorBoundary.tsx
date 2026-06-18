import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-svh flex items-center justify-center p-4 bg-slate-50">
          <div className="text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="font-semibold text-slate-700 mb-2">오류가 발생했습니다</p>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-medium"
            >
              다시 시도
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
