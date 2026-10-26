import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GameButton } from './GameButton';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MathQuest error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100svh] flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
          <div className="max-w-md w-full bg-stone-900 border-3 border-amber-500 p-8 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-3xl font-black mx-auto mb-4">
              !
            </div>
            <h2 className="text-2xl font-black mb-2">Something went wrong</h2>
            <p className="text-sm text-stone-300 font-medium mb-6">
              Our explorer equipment encountered a momentary glitch. Tap below to refresh and continue your adventure!
            </p>
            <GameButton tone="primary" onClick={this.handleReset} className="w-full">
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </GameButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
