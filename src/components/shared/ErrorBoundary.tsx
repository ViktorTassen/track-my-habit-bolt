import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-900/20 rounded-lg">
          <h2 className="text-red-400 font-medium mb-2">Something went wrong</h2>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}