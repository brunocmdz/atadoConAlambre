import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePublic from './components/HomePublic';
import HomePrivate from './components/HomePrivate';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import { useState, useEffect } from 'react';

function App() {
  const [view, setView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const adminValue = localStorage.getItem('isAdmin');
    setIsLoggedIn(!!userId);
    setIsAdmin(adminValue === 'true' || adminValue === '1');
    const name = localStorage.getItem('userName') || '';
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowAdminPanel(false);
    setUserName('');
    setView('home');
  };

  let content;
  if (view === 'home') {
    content = isLoggedIn ? <HomePrivate /> : <HomePublic />;
  } else if (view === 'register') {
    content = <Register />;
  } else if (view === 'login') {
    content = <Login />;
  }

  return (
    <div className="layout">
      <Navbar
        onRegisterClick={() => setView('register')}
        onLoginClick={() => setView('login')}
        onHomeClick={() => setView('home')}
        onLogoutClick={handleLogout}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        showAdminPanel={showAdminPanel}
        onToggleAdminPanel={() => setShowAdminPanel((prev) => !prev)}
        userName={userName}
      />
      <main className="content">
        {content}
        {isLoggedIn && isAdmin && showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
