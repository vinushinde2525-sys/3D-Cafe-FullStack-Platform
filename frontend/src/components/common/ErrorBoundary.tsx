import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">☕</div>
            <h2 className="font-serif text-3xl text-espresso mb-3">Something went wrong</h2>
            <p className="text-ink-3 mb-8 font-sans text-base">
              We've spilled some coffee. Our team has been notified.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-espresso"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
