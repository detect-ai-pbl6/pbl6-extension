import React, { useState, useEffect } from 'react';
import Index from '../components/Index';
import New from '../components/New';
import Keys from '../components/Keys';
import History from '../components/History';
import Login from '../components/Login';
import Register from '../components/Register';
import Header from '../components/Header';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [activePage, setActivePage] = useState('index');
  const [user, setUser] = useState(null);

  const navigateToPage = (page) => {
    setActivePage(page);
  };
  
  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch(`${apiUrl}/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLoginSuccess = () => {
    chrome.storage.local.get(['accessToken'], (result) => {
      if (result.accessToken) {
        fetchUserData(result.accessToken);
      }
    });
    setActivePage('index');
  };

  useEffect(() => {
    const getAccessToken = () => {
      chrome.storage.local.get(['accessToken'], (result) => {
        if (result.accessToken) {
          fetchUserData(result.accessToken);
        }
      });
    };

    getAccessToken();

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.accessToken) {
        getAccessToken();
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener();
    };
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} navigateToPage={navigateToPage} />
      {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
      {activePage === 'new' && <New navigateToPage={navigateToPage} />}
      {activePage === 'keys' && <Keys navigateToPage={navigateToPage} />}
      {activePage === 'history' && <History navigateToPage={navigateToPage} />}
      {activePage === 'login' && <Login onLoginSuccess={handleLoginSuccess} navigateToPage={navigateToPage}/>}
      {activePage === 'register' && <Register navigateToPage={navigateToPage} />}
    </>
  );
}
