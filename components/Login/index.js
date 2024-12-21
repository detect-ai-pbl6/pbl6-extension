"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import styles from '../../styles/Login.module.css';
import { useRouter } from "next/router";

export default function Login({onLoginSuccess, navigateToPage}) {
  const [error, setError] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrlAll = process.env.NEXT_PUBLIC_API_URL_All;
  const [providers, setProvider] = useState([]);
  

  function saveTokensToStorage(access, refresh, expiration, api_key) {
    const data = {
        accessToken: access,
        refreshToken: refresh,
        expirationTime: expiration,
        apiKey: api_key,
    };

    chrome.runtime.sendMessage(
      { type: "STORAGE_UPDATED", payload: data },
      (response) => {
          if (chrome.runtime.lastError) {
              console.error("Error during storage update:", chrome.runtime.lastError.message);
          } else {
              console.log("STORAGE_UPDATED response:", response?.message);
          }
      }
    );
  }

  // Gọi hàm với giá trị cụ thể
  // saveTokensToStorage("myAccessToken", "myRefreshToken", 3600, "myApiKey");

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`${apiUrlAll}/_allauth/browser/v1/config`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("socialaccount:", data.data.socialaccount);
        setProvider(data.data.socialaccount.providers);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        toast.error("Failed to fetch providers");
      }
    };

    fetchProvider();
  }, [apiUrlAll]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert(data.message || "Login failed.");
        throw new Error("Invalid email or password");
      }

      const data = await res.json();
      const expirationTime = Date.now() + 300000;
      console.log("data: ", data);
      saveTokensToStorage(data.access, data.refresh, expirationTime, data.api_key);

      alert(data.message || "Login successful.");
      onLoginSuccess(data.user);
    } catch (error) {
      setError("Fail to login");
      toast.error("Fail to login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password must be at least 8 characters");
      return;
    }

    await handleLogin(email, password);
  };

  const handleSocialLogin = (id) => {
    const callbackUrl = "https://pbl6-frontend-hoai-baos-projects.vercel.app/login";
    window.open(callbackUrl, "_blank");
  };
  
  return (
    <div className={styles.container}>
        <div className={styles['form-container']}>
          <div className={styles['form-header']}>
            <h2 className={styles['form-title']}>Sign in to your account</h2>
          </div>

          <div className={styles['form-wrapper']}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className={styles['input-label']}>
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={styles['input-field']}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={styles['input-label']}>
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={styles['input-field']}
                  />
                </div>
              </div>

              <div className={styles['checkbox-wrapper']}>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={styles['checkbox']}
                  />
                  <label htmlFor="remember-me" className={styles['checkbox-label']}>
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <Link href="#" className={styles['forgot-password']}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={styles['submit-button']}
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className={styles['separator-wrapper']}>
              <div className={styles['separator-line']} />
              <div className={styles['separator-text']}>Or continue with</div>
            </div>

            <div className={styles['social-button-wrapper']}>
              {providers?.map((provider) => {
                const handleClick = (providerId) => {
                  console.log("handleClick");
                  // handleSocialLogin(providerId);
                  handleSocialLogin(providerId, () => {
                    // Callback sau khi đăng nhập xã hội thành công
                    console.log("Đăng nhập xã hội thành công");
                    toast.success("Logged in with " + providerId);
                    // Ví dụ: điều hướng hoặc thực hiện các hành động khác
                    navigateToPage("index");
                  });
                };

                if (provider.id === 'google') {
                  return (
                    <button key={provider.id} onClick={() => handleClick(provider.id)}>
                      <FcGoogle className={styles['social-button-icon']} />
                        Sign in with Google
                    </button>
                  );
                }

                if (provider.id === 'github') {
                  return (
                    <button key={provider.id} onClick={() => handleClick(provider.id)}>
                      <svg
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        width="16"
                        height="16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.91-1.296 2.75-1.026 2.75-1.026.545 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.85-2.341 4.688-4.56 4.935.36.305.681.905.681 1.823 0 1.317-.012 2.385-.012 2.705 0 .267.182.578.688.482A10.012 10.012 0 0020 10.017C20 4.484 15.523 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sign in with GitHub
                    </button>
                  );
                }

                return null;
              })}
            </div>

          </div>
        </div>
    </div>
  );
};
