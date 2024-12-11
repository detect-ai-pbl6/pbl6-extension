import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Index from '../components/Index';
import New from '../components/New';
import Login from '../components/Login';
import Register from '../components/Register';
import Header from '../components/Header';

export default function Home() {
  const [activePage, setActivePage] = useState('index');
  const [user, setUser] = useState(null);

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData); // Cập nhật trạng thái người dùng
    setActivePage('index'); // Quay lại trang chủ sau khi đăng nhập thành công
  };

  return (
    <>
      <Header user={user} setUser={setUser} navigateToPage={navigateToPage} />
      {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
      {activePage === 'new' && <New navigateToPage={navigateToPage} />}
      {activePage === 'login' && <Login onLoginSuccess={handleLoginSuccess} navigateToPage={navigateToPage}/>}
      {activePage === 'register' && <Register navigateToPage={navigateToPage} />}
    </>
  );
}
