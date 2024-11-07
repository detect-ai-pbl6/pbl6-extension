"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "../../styles/Login.module.css"; // Sử dụng cùng file CSS với Login

const RegisterPage = ({navigateToPage}) => {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const acceptTerms = form["terms"].checked;

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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and privacy policy");
      toast.error("You must accept the terms and privacy policy");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      toast.success("Registration successful");
      navigateToPage('login');
    } catch (error) {
      setError("Fail to register");
      toast.error("Fail to register");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["form-container"]}>
        <div className={styles["form-header"]}>
          <h2 className={styles["form-title"]}>Create an Account</h2>
        </div>

        <div className={styles["form-wrapper"]}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className={styles['input-wrapper']}>
              <div>
                <label htmlFor="firstname" className={styles["input-label"]}>
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="firstname"
                    autoComplete="firstname"
                    required
                    className={styles["input-field"]}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className={styles["input-label"]}>
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="lastname"
                    autoComplete="lastname"
                    required
                    className={styles["input-field"]}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={styles["input-label"]}>
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={styles["input-field"]}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={styles["input-label"]}>
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={styles["input-field"]}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={styles["input-label"]}>
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={styles["input-field"]}
                />
              </div>
            </div>

            <div className={styles['checkbox']}>
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className={styles['input-checkbox']}
              />
              <label htmlFor="terms" className={styles['input-checkbox-label']}>
                Accept our terms and privacy policy
              </label>
            </div>

            <div>
              <button
                type="submit"
                className={styles["submit-button"]}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
