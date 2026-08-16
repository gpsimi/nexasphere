'use client';

import React from 'react';
import { Alert, Button } from '@nexasphere/ui';

interface MfeBoundaryProps {
  name?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
}

interface MfeBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class MfeErrorBoundary extends React.Component<MfeBoundaryProps, MfeBoundaryState> {
  constructor(props: MfeBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MfeBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`MFE Error Boundary [${this.props.name}] caught an error:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        { className: 'p-4 bg-white border border-neutral-200 rounded' },
        React.createElement(
          Alert,
          {
            variant: 'error',
            title: `${this.props.name || 'Module'} is temporarily unavailable.`,
            action: React.createElement(
              Button,
              { variant: 'danger', size: 'sm', onClick: this.handleRetry },
              'Try Again'
            )
          },
          `The ${this.props.name || 'module'} could not be loaded. Other parts of NexaSphere remain fully functional.`
        )
      );
    }

    return this.props.children;
  }
}
