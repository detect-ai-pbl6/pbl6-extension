import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/Navbar.module.css';

const Header = ({ user, setUser, navigateToPage }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access");
      const expirationTime = localStorage.getItem("expiration");

      if (accessToken) {
        if (expirationTime && Date.now() < parseInt(expirationTime)) {
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
            setUser(data.email);
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    fetchUserData();
  }, [user]);

  const signOut = () => {
    console.log("User signed out");
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("expiration");
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li>
              <a href="#" onClick={() => navigateToPage('index')}>Home</a>
            </li>
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
              <span className={styles.username}>{user}</span>
              <button
                onClick={() => {
                  signOut();
                  localStorage.removeItem("access");
                  localStorage.removeItem("refresh");
                  localStorage.removeItem("expiration");
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
