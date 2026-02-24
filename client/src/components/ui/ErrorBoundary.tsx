import { Component, type ErrorInfo, type ReactNode } from 'react';
import { XCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <XCircle size={64} className="text-coral mx-auto mb-4" />
            <h1 className="font-display text-3xl tracking-widest text-coral mb-2">
              SOMETHING BROKE
            </h1>
            <p className="font-mono text-sm text-secondary mb-6">
              The app crashed. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="font-mono text-xs text-yellow hover:underline"
            >
              ← Back to Feed
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 text-left text-xs text-muted bg-surface p-4 rounded-md overflow-auto">
                {this.state.error?.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}