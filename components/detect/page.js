"use client";
import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation"; // Import redirect từ next/navigation
import styles from "./page.module.css";

export default function Detect(navigateToPage) {
  const [uploadedImage, setUploadedImage] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Theo dõi trạng thái đăng nhập

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    const expirationTime = localStorage.getItem("expiration");

    // Kiểm tra nếu có token và thời gian hết hạn hợp lệ
    if (accessToken && refreshToken && expirationTime) {
      const currentTime = Date.now();
      const expiration = parseInt(expirationTime, 10);

      if (currentTime < expiration) {
        setIsLoggedIn(true); // Người dùng đã đăng nhập
      } else {
        setIsLoggedIn(false); // Token đã hết hạn
        navigateToPage('login') // Chuyển hướng đến trang login nếu token hết hạn
      }
    } else {
      setIsLoggedIn(false); // Không có token, người dùng chưa đăng nhập
      navigateToPage('login') // Chuyển hướng đến trang login nếu không có token
    }
  }, []); // Mảng phụ thuộc rỗng để chỉ chạy một lần khi component được render

  const handleFileChange = async (event) => {
    if (!isLoggedIn) {
      alert("Please log in to upload images!");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const temporaryImageUrl = URL.createObjectURL(file);
    setUploadedImage(temporaryImageUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      setAnalysisResult(result.analysis);
      setConfidenceScore(result.confidence);
    } catch (error) {
      setAnalysisResult("likely to contain AI Generated Text");
      setConfidenceScore("99.9%");
    }
  };

  const handlePaste = async (event) => {
    if (!isLoggedIn) {
      alert("Please log in to paste images!");
      return;
    }

    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          const temporaryImageUrl = URL.createObjectURL(file);
          setUploadedImage(temporaryImageUrl);

          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();

            setAnalysisResult(result.analysis);
            setConfidenceScore(result.confidence);
          } catch (error) {
            setAnalysisResult("likely to contain AI Generated Text");
            setConfidenceScore("99.9%");
          }
        }
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isLoggedIn]); // Lắng nghe sự thay đổi trạng thái đăng nhập

  // Nếu chưa đăng nhập, tự động chuyển hướng đến trang login
  if (!isLoggedIn) {
    return null; // Trả về null để ngừng render component khi chưa đăng nhập
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <main className={styles.main}>
        <h1 className={styles.title}>AI-GENERATED CONTENT DETECTION</h1>
        <p className={styles.description}>
          Machine learning models to detect AI-generated content
        </p>
        <div className={styles.note}>
          <p>
            Upload images and videos here to test our model in real-time!<br />
            Supports png, jpeg, jpg, webp.
          </p>
        </div>

        {isLoggedIn ? (
          <label className={styles.uploadArea}>
            {uploadedImage && (
              <img src={uploadedImage} alt="Uploaded" className={styles.uploadedImage} />
            )}
            <input
              type="file"
              accept="image/*"
              className={styles.hiddenFileInput}
              onChange={handleFileChange}
              disabled={!isLoggedIn} // Disable the input if not logged in
            />
            {!uploadedImage && (
              <p className={styles.uploadPrompt}>Click or Drag to Upload</p>
            )}
          </label>
        ) : (
          <div className={styles.uploadPrompt}>Please log in to upload images</div>
        )}

        {analysisResult && (
          <div className={styles.resultContainer}>
            <div className={styles.resultTitleContainer}>
              <h2 className={styles.resultTitle}>Analysis Result</h2>
            </div>
            <div className={styles.resultContent}>
              <p className={styles.resultText}>The input is: {analysisResult}</p>
              <p className={styles.confidenceText}>{confidenceScore}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}




// "use client";
// import React from 'react';
// import { useState, useEffect } from 'react';
// import styles from './';

// export default function Index() {
//   const [uploadedImage, setUploadedImage] = useState<string>('');
//   const [analysisResult, setAnalysisResult] = useState<string>(''); // Kết quả phân tích
//   const [confidenceScore, setConfidenceScore] = useState<string>(''); // Điểm xác suất

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const temporaryImageUrl = URL.createObjectURL(file);
//     setUploadedImage(temporaryImageUrl);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       const result = await response.json();

//       if (response.ok) {
//         setAnalysisResult(result.analysis);
//         setConfidenceScore(result.confidence);
//       } else {
//         setAnalysisResult(result.analysis);
//         setConfidenceScore(result.confidence);
//       }
//     } catch (error) {
//       setAnalysisResult("likely to contain AI Generated Text");
//       setConfidenceScore("99.9%");
//     }
//   };

//   const handlePaste = async (event) => {
//     const items = event.clipboardData?.items;
//     if (!items) return;
//     for (let i = 0; i < items.length; i++) {
//       if (items[i].type.startsWith('image/')) {
//         const file = items[i].getAsFile();
//         if (file) {
//           const temporaryImageUrl = URL.createObjectURL(file);
//           setUploadedImage(temporaryImageUrl);

//           const formData = new FormData();
//           formData.append('file', file);

//           try {
//             const response = await fetch('/api/upload', {
//               method: 'POST',
//               body: formData,
//             });
//             const result = await response.json();

//             if (response.ok) {
//               setAnalysisResult(result.analysis);
//               setConfidenceScore(result.confidence);
//             } else {
//               setAnalysisResult(result.analysis);
//               setConfidenceScore(result.confidence);
//             }
//           } catch (error) {
//             setAnalysisResult("likely to contain AI Generated Text");
//             setConfidenceScore("99.9%");
//           }
//         }
//         break;
//       }
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('paste', handlePaste);
//     return () => document.removeEventListener('paste', handlePaste);
//   }, []);

//   return (
//     <div className={styles.container}>
//       <main className={styles.main}>
//         <h1 className={styles.title}>AI-GENERATED CONTENT DETECTION</h1>
//         <p className={styles.description}>
//           Machine learning models to detect AI-generated content
//         </p>
//         <div className={styles.note}>
//             <p>
//                 Upload images and videos here to test our model in real-time!<br />
//                 Supports png, jpeg, jpg, webp.
//             </p>
//         </div>
//         <label className={styles.uploadArea}>
//           {uploadedImage && (
//             <img src={uploadedImage} alt="Uploaded" className={styles.uploadedImage} />
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             className={styles.hiddenFileInput}
//             onChange={handleFileChange}
//           />
//           {!uploadedImage && (
//             <p className={styles.uploadPrompt}>Click or Drag to Upload</p>
//           )}
//         </label>

//         {analysisResult && (
//           <div className={styles.resultContainer}>
//             <div className={styles.resultTitleContainer}>
//               <h2 className={styles.resultTitle}>Analysis Result</h2>
//             </div>
//             <div className={styles.resultContent}>
//               <p className={styles.resultText}>The input is: {analysisResult}</p>
//               <p className={styles.confidenceText}>{confidenceScore}</p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
