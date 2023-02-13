import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/user_action';

function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.user.isLoading);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // 로그인이 된 상태
                navigate('/');
                dispatch(setUser(user));
                console.log('user', user);
            } else {
                // 로그인 되지 않은 상태
                navigate('/login');
                dispatch(clearUser(user));
            }
        });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return (
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        );
    }
}

export default App;
