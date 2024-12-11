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
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("expiration", expirationTime.toString());

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

  // const handleSocialLogin = async (id) => {
  //   const form = document.createElement("form");
  //   form.style.display = "none";
  //   form.method = "POST";
  //   form.action = `${apiUrl}/auth/login/socials`;
  //   const data = {
  //     provider: id,
  //     callback_url: "http://localhost:3000",
  //   };
  //   console.log(data);

  //   Object.entries(data).forEach(([k, v]) => {
  //     const input = document.createElement("input");
  //     input.name = k;
  //     input.value = v;
  //     form.appendChild(input);
  //   });
  //   document.body.appendChild(form);
  //   form.submit();
  // }
// Hàm trích xuất các tham số OAuth từ URL
function extractOAuthParams(url) {
  const urlParams = new URLSearchParams(`https://accounts.google.com`);

  // Trích xuất các tham số cần thiết từ URL
  const clientId = urlParams.get('client_id');
  const redirectUri = urlParams.get('redirect_uri');
  const scope = urlParams.get('scope');
  const responseType = urlParams.get('response_type');
  const state = urlParams.get('state');
  const accessType = urlParams.get('access_type');
  const codeChallengeMethod = urlParams.get('code_challenge_method');
  const codeChallenge = urlParams.get('code_challenge');
  const service = urlParams.get('service');
  const o2v = urlParams.get('o2v');
  const ddm = urlParams.get('ddm');
  const flowName = urlParams.get('flowName');

  // Log các tham số để kiểm tra
  console.log("client_id:", clientId);
  console.log("redirect_uri:", redirectUri);
  console.log("scope:", scope);
  console.log("response_type:", responseType);
  console.log("state:", state);
  console.log("access_type:", accessType);
  console.log("code_challenge_method:", codeChallengeMethod);
  console.log("code_challenge:", codeChallenge);
  console.log("service:", service);
  console.log("o2v:", o2v);
  console.log("ddm:", ddm);
  console.log("flowName:", flowName);

  // Trả về đối tượng chứa tất cả các tham số
  return {
    clientId,
    redirectUri,
    scope,
    responseType,
    state,
    accessType,
    codeChallengeMethod,
    codeChallenge,
    service,
    o2v,
    ddm,
    flowName
  };
}

const handleSocialLogin = async (id) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    console.log("url: ", url);
    const oauthParams = extractOAuthParams(url);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${oauthParams.clientId}&redirect_uri=${oauthParams.redirectUri}&scope=${oauthParams.scope}&response_type=${oauthParams.responseType}&state=${oauthParams.state}&access_type=${oauthParams.accessType}&code_challenge_method=${oauthParams.codeChallengeMethod}&code_challenge=${oauthParams.codeChallenge}&service=${oauthParams.service}&o2v=${oauthParams.o2v}&ddm=${oauthParams.ddm}&flowName=${oauthParams.flowName}`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async (redirectUrl) => {
        if (redirectUrl) {
          const urlParams = new URLSearchParams(new URL(redirectUrl).search);
          const token = urlParams.get("token");

          if (token) {
            const response = await fetch(`${apiUrl}/auth/tokens`, {
              credentials: "include",
            });

            if (response.ok) {
              const data = await response.json();
              const expirationTime = Date.now() + 300000;
              localStorage.setItem("access", data.access);
              localStorage.setItem("refresh", data.refresh);
              localStorage.setItem("expiration", expirationTime.toString());

              console.log("Login successful");
              alert(data.message || "Login successful.");
              onLoginSuccess(data.user);

              chrome.windows.getCurrent({}, (currentWindow) => {
                chrome.windows.remove(currentWindow.id);
              });
            } else {
              console.error("Error fetching tokens");
            }
          } else {
            console.error("Failed to get token from callback URL");
          }
        } else {
          console.error("Authentication failed");
        }
      }
    );
  });
};




  // const handleSocialLogin = async (id) => {
  //   const redirectUri = "http://localhost:3000"; // URL callback mà bạn sẽ nhận lại thông tin
  //   // const authUrl = `${apiUrl}/auth/login/socials?provider=${id}&callback_url=${redirectUri}`;
  //   const authUrl = `${apiUrl}/auth/login/socials`;
  //   console.log('Auth URL:', redirectUri);

  //   // Mở OAuth flow mà không chuyển hướng trang
  //   chrome.identity.launchWebAuthFlow(
  //     {
  //       url: redirectUri,
  //       interactive: true, // Đảm bảo là pop-up sẽ xuất hiện để người dùng đăng nhập
  //     },
  //     async (redirectUrl) => {
  //       // redirectUrl sẽ chứa URL trả về sau khi đăng nhập thành công
  //       if (redirectUrl) {
  //         // Trích xuất thông tin token từ redirectUrl
  //         const urlParams = new URLSearchParams(new URL(redirectUrl).search);
  //         const token = urlParams.get('token'); // giả sử token là tham số trong URL
  //         console.log('urlParams: ',urlParams);
  //         console.log('token: ',token);
  
  //         if (token) {
  //           // Sau khi có token, bạn có thể gọi API để lấy dữ liệu người dùng
  //           const response = await fetch(`${apiUrl}/auth/tokens`, {
  //             credentials: 'include',
  //           });
  
  //           if (response.ok) {
  //             const data = await response.json();
  //             const expirationTime = Date.now() + 300000;
  //             localStorage.setItem('access', data.access);
  //             localStorage.setItem('refresh', data.refresh);
  //             localStorage.setItem('expiration', expirationTime.toString());
  
  //             console.log('Login successful');
  //             alert(data.message || 'Login successful.');
  //             onLoginSuccess(data.user);
  //           } else {
  //             console.error('Error fetching tokens');
  //           }
  //         }
  //       } else {
  //         console.error('Authentication failed');
  //       }
  //     }
  //   );
  // };
  



  // const extensionId = chrome.runtime.id;
  // const callbackUrl = `chrome-extension://${extensionId}/callback`;
  // console.log("callbackUrl:", callbackUrl);
  // const port = chrome.runtime.connect({ name: "social-login" });

  // const handleSocialLogin = async (id) => {
  //   console.log("handleSocialLogin");

  //   const form = document.createElement("form");
  //   form.style.display = "none";
  //   form.method = "POST";
  //   form.action = `${apiUrl}/auth/login/socials`;

  //   const data = {
  //     provider: id,
  //     callback_url: callbackUrl,
  //   };

  //   Object.entries(data).forEach(([k, v]) => {
  //     const input = document.createElement("input");
  //     input.name = k;
  //     input.value = v;
  //     form.appendChild(input);
  //   });

  //   document.body.appendChild(form);
  //   form.submit();

  //   // Sau khi đăng nhập, gửi thông điệp tới extension
  //   const response = await fetch(`${apiUrl}/auth/login/socials`, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   // const responseData = await response.json();
  //   // console.log(responseData);  // Kiểm tra dữ liệu trả về
  //   if (!response.ok) {
  //     const errorText = await response.text();  // Đọc nội dung HTML trả về
  //     console.error("API Error:", errorText);    // In ra nội dung HTML để biết lỗi
  //     throw new Error(`Error: ${response.status} - ${errorText}`);
  //   }

  //   if (response.ok) {
  //     // Gửi thông điệp qua kết nối
  //     port.postMessage({
  //       type: 'SOCIAL_LOGIN_SUCCESS',
  //       data: responseData,
  //     });
  //   }
  // };


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
