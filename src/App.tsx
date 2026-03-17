import { Component, Suspense, type ReactNode } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const isChunkError = error.message.includes("dynamically imported module");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          {isChunkError ? (
            <p className="font-heading text-lg">site updated — please reload</p>
          ) : (
            <p className="font-heading text-lg">something went wrong</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="border border-ink px-4 py-1 text-sm hover:bg-ink hover:text-cream transition-colors font-body"
          >
            reload
          </button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <Navbar />
      <MobileNav />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense
            fallback={<div className="fixed inset-0 z-[9998] bg-cream" />}
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
