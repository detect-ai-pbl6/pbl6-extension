"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "../../styles/Login.module.css";

const RegisterPage = ({ navigateToPage }) => {
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.firstname) {
      errors.firstname = "First name is required.";
    }

    if (!formData.lastname) {
      errors.lastname = "Last name is required.";
    }

    if (!isValidEmail(formData.email)) {
      errors.email = "Email is invalid.";
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and privacy policy.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      firstname: form.firstname.value.trim(),
      lastname: form.lastname.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      confirmPassword: form.confirmPassword.value.trim(),
      acceptTerms: form["terms"].checked,
    };

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Object.values(errors).forEach((error) => toast.error(error)); // Hiển thị tất cả lỗi
      return;
    }

    setFormErrors({}); // Xóa lỗi trước đó nếu hợp lệ

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.status === 400 || res.status === 409) {
        console.log(res.json());
        const data = await res.json();
        setFormErrors({ server: data.message || "Registration failed." });
        alert(data.message || "Registration failed.");
        return;
      }

      if (!res.ok) {
        throw new Error("Unexpected error occurred.");
      }

      alert("Registration successful.");
      navigateToPage("login");
    } catch (err) {
      setFormErrors({ server: "Failed to register." });
      toast.error("Failed to register.");
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
            <div className={styles["input-wrapper"]}>
              <div>
                <label htmlFor="firstname" className={styles["input-label"]}>
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoComplete="given-name"
                    className={styles["input-field"]}
                  />
                </div>
                {formErrors.firstname && (
                  <p className={styles["error-message"]}>
                    {formErrors.firstname}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className={styles["input-label"]}>
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    autoComplete="family-name"
                    className={styles["input-field"]}
                  />
                </div>
                {formErrors.lastname && (
                  <p className={styles["error-message"]}>
                    {formErrors.lastname}
                  </p>
                )}
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
                  className={styles["input-field"]}
                />
              </div>
              {formErrors.email && (
                <p className={styles["error-message"]}>{formErrors.email}</p>
              )}
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
                  className={styles["input-field"]}
                />
              </div>
              {formErrors.password && (
                <p className={styles["error-message"]}>{formErrors.password}</p>
              )}
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
                  className={styles["input-field"]}
                />
              </div>
              {formErrors.confirmPassword && (
                <p className={styles["error-message"]}>
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className={styles["checkbox"]}>
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className={styles["input-checkbox"]}
              />
              <label htmlFor="terms" className={styles["input-checkbox-label"]}>
                Accept our terms and privacy policy
              </label>
              {formErrors.acceptTerms && (
                <p className={styles["error-message"]}>
                  {formErrors.acceptTerms}
                </p>
              )}
            </div>

            {formErrors.server && (
              <p className={styles["error-message"]}>{formErrors.server}</p>
            )}

            <div>
              <button type="submit" className={styles["submit-button"]}>
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

// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import styles from "../../styles/Login.module.css"; // Sử dụng cùng file CSS với Login

// const RegisterPage = ({navigateToPage}) => {
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//   const isValidEmail = (email) => {
//     const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     const firstname = form.firstname.value;
//     const lastname = form.lastname.value;
//     const email = form.email.value;
//     const password = form.password.value;
//     const confirmPassword = form.confirmPassword.value;
//     const acceptTerms = form["terms"].checked;

//     if (!isValidEmail(email)) {
//       setError("Email is invalid");
//       toast.error("Email is invalid");
//       return;
//     }

//     if (!password || password.length < 8) {
//       setError("Password is invalid");
//       toast.error("Password must be at least 8 characters");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (!acceptTerms) {
//       setError("You must accept the terms and privacy policy");
//       toast.error("You must accept the terms and privacy policy");
//       return;
//     }

//     try {
//       const res = await fetch(`${apiUrl}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ firstname, lastname, email, password }),
//       });

//       if (!res.ok) {
//         throw new Error("Registration failed");
//       }

//       const data = await res.json();
//       toast.success("Registration successful");
//       navigateToPage('login');
//     } catch (error) {
//       setError("Fail to register");
//       toast.error("Fail to register");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles["form-container"]}>
//         <div className={styles["form-header"]}>
//           <h2 className={styles["form-title"]}>Create an Account</h2>
//         </div>

//         <div className={styles["form-wrapper"]}>
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div className={styles['input-wrapper']}>
//               <div>
//                 <label htmlFor="firstname" className={styles["input-label"]}>
//                   First name
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     id="firstname"
//                     name="firstname"
//                     type="firstname"
//                     autoComplete="firstname"
//                     required
//                     className={styles["input-field"]}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="lastname" className={styles["input-label"]}>
//                   Last name
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     id="lastname"
//                     name="lastname"
//                     type="lastname"
//                     autoComplete="lastname"
//                     required
//                     className={styles["input-field"]}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className={styles["input-label"]}>
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className={styles["input-field"]}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className={styles["input-label"]}>
//                 Password
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   className={styles["input-field"]}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className={styles["input-label"]}>
//                 Confirm Password
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   className={styles["input-field"]}
//                 />
//               </div>
//             </div>

//             <div className={styles['checkbox']}>
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 required
//                 className={styles['input-checkbox']}
//               />
//               <label htmlFor="terms" className={styles['input-checkbox-label']}>
//                 Accept our terms and privacy policy
//               </label>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className={styles["submit-button"]}
//               >
//                 Create Account
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
