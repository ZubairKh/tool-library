import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignupForm } from './components/SignupForm';
import { SigninForm } from './components/SigninForm';
import { useTools } from './hooks/useTools';
import { ToolForm } from './components/ToolForm';
import { ToolList } from './components/ToolList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UserProfileCard } from './components/UserProfileCard';
import { AIToolFinder } from './components/AIToolFinder';
import './App.css';

function MainApp() {
  const { user, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const { tools, loading, addTool } = useTools();

  if (!user) {
    return (
      <div className="app-shell auth-shell">
        <Header user={null} onLogout={logout} />
        <main className="page-content">
          <section className="auth-card">
            <p className="eyebrow">Community Marketplace</p>
            <h1 className="section-title">Welcome to Tool Library</h1>
            <p className="section-subtitle">Sign in to manage your tools, availability, and profile in one place.</p>
            {showSignup ? <SignupForm onSuccess={() => {}} /> : <SigninForm onSuccess={() => {}} />}
            <button onClick={() => setShowSignup(!showSignup)} className="toggle-auth-btn">
              {showSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header user={user} onLogout={logout} />
      <main className="page-content dashboard-layout">
        <aside>
          <UserProfileCard user={user} />
        </aside>
        <section className="library-panel">
          <div className="library-panel-head">
            <div>
              <p className="eyebrow">Tools Library</p>
              <h2 className="section-title">Share and Discover Community Tools</h2>
              <p className="section-subtitle">Add your tools and keep your inventory visible to the community.</p>
            </div>
          </div>
          <ToolForm onAdd={addTool} />
          {loading ? <p className="section-subtitle">Loading tools...</p> : <ToolList tools={tools} />}
        </section>

        <AIToolFinder tools={tools} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}