import { useState, useEffect } from 'react';
import styles from '../../styles/Navbar.module.css';

const Header = ({ user, setUser, navigateToPage }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      chrome.storage.local.get(['accessToken', 'expirationTime'], async (result) => {
        const { accessToken, expirationTime } = result;

        if (accessToken) {
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
            console.error(error);
          }
        } else {
          console.log("No access token found.");
        }
      });
    };

    fetchUserData();
  }, []);

  const signOut = () => {
    setUser(null);
    chrome.runtime.sendMessage({ type: "LOGOUT_EXT" }, (response) => {
      if (chrome.runtime.lastError) {
          console.error("Error during logout:", chrome.runtime.lastError.message);
      } else {
          console.log("Logged out successfully:", response.message);
      }
    });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li>
              <a href="#" onClick={() => navigateToPage('index')}>Home</a>
            </li>
          {!user ? (
            null
          ) : (
            <>
              <li>
                <a href="#" onClick={() => navigateToPage('keys')}>Keys</a>
              </li>
              <li>
                <a href="#" onClick={() => navigateToPage('history')}>History</a>
              </li>
            </>
          )}
          </ul>

        <div className={styles.authLinks}>
          {!user ? (
            <>
              <ul className={styles.navLinks}>
                <li>
                  <a href="#" onClick={() => navigateToPage('login')}>Login</a>                  
                </li>
              </ul>
              <button onClick={() => navigateToPage('register')} className={styles.signupButton}>
                Sign up
              </button>
            </>
          ) : (
            <>
              <span className={styles.username}>{user.email}</span>
              <button
                onClick={() => {
                  signOut();
                }}
                className={styles.signupButton}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
