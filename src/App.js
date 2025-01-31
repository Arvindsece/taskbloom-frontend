import React from 'react';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [showRegister, setShowRegister] = React.useState(false);

    if (!isAuthenticated) {
        return showRegister ? (
            <Register onSwitch={() => setShowRegister(false)} />
        ) : (
            <Login onSwitch={() => setShowRegister(true)} />
        );
    }

    return <Home />;
};

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <AppContent />
            </div>
        </AuthProvider>
    );
}

export default App;
