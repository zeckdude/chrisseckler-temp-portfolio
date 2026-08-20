"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import posthog from "posthog-js";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/ops")) return;
      posthog.captureException(error, { componentStack: info.componentStack });
    } catch {
      // never throw from the boundary
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-content px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-extrabold text-text-primary">Something went wrong</h1>
          <p className="mt-3 text-text-secondary">
            Reload the page and try again. If it keeps happening, use the feedback tab.
          </p>
          <button
            type="button"
            className="mt-6 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
