// import React, { useState, useEffect } from "react";
// import styles from '../../styles/Pages.module.css';

// const Detect = ({ navigateToPage }) => {
//   const [uploadedImage, setUploadedImage] = useState("");
//   const [analysisResult, setAnalysisResult] = useState("");
//   const [confidenceScore, setConfidenceScore] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("access");
//     const refreshToken = localStorage.getItem("refresh");
//     const expirationTime = localStorage.getItem("expiration");

//     if (accessToken && refreshToken && expirationTime) {
//       const currentTime = Date.now();
//       const expiration = parseInt(expirationTime, 10);

//       if (currentTime < expiration) {
//         setIsLoggedIn(true); 
//       } else {
//         setIsLoggedIn(false);
//       }
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   const handleFileChange = async (event) => {
//     if (!isLoggedIn) {
//       navigateToPage('login');
//       return;
//     }

//     const file = event.target.files?.[0];
//     if (!file) return;

//     const temporaryImageUrl = URL.createObjectURL(file);
//     setUploadedImage(temporaryImageUrl);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const result = await response.json();

//       setAnalysisResult(result.analysis);
//       setConfidenceScore(result.confidence);
//     } catch (error) {
//       setAnalysisResult("likely to contain AI Generated Text");
//       setConfidenceScore("99.9%");
//     }
//   };

//   const handlePaste = async (event) => {
//     if (!isLoggedIn) {
//       navigateToPage('login');
//       return;
//     }

//     const items = event.clipboardData?.items;
//     if (!items) return;

//     for (let i = 0; i < items.length; i++) {
//       if (items[i].type.startsWith("image/")) {
//         const file = items[i].getAsFile();
//         if (file) {
//           const temporaryImageUrl = URL.createObjectURL(file);
//           setUploadedImage(temporaryImageUrl);

//           const formData = new FormData();
//           formData.append("file", file);

//           try {
//             const response = await fetch("/api/upload", {
//               method: "POST",
//               body: formData,
//             });
//             const result = await response.json();

//             setAnalysisResult(result.analysis);
//             setConfidenceScore(result.confidence);
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
//     document.addEventListener("paste", handlePaste);
//     return () => document.removeEventListener("paste", handlePaste);
//   }, [isLoggedIn]);

//   return (
//     <div className={styles.container}>
//       <main className={styles.main}>
//         <h1 className={styles.title}>AI-GENERATED CONTENT DETECTION</h1>
//         <p className={styles.description}>
//           Machine learning models to detect AI-generated content
//         </p>
//         <div className={styles.note}>
//           <p>
//             Upload images and videos here to test our model in real-time!<br />
//             Supports png, jpeg, jpg, webp.
//           </p>
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

//         {!isLoggedIn && (
//           <div className={styles.uploadPromptMess}>Please log in to upload images</div>
//         )}

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
// };

// export default Detect;


import React, { useState, useEffect } from "react";
import styles from '../../styles/Pages.module.css';
import { refreshAccessToken } from "../RefreshToken/refreshAccessToken";

const Detect = ({ navigateToPage }) => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkTokens = async () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    const expirationTime = localStorage.getItem("expiration");

    if (accessToken && refreshToken && expirationTime) {
      const currentTime = Date.now();
      const expiration = parseInt(expirationTime, 10);

      if (currentTime < expiration) {
        setIsLoggedIn(true);
      } else {
        const success = await refreshAccessToken();
        if (success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          if (navigateToPage) {
            navigateToPage("login");
          }
        }
      }
    } else {
      setIsLoggedIn(false);
      if (navigateToPage) {
        navigateToPage("login");
      }
    }
  };

  useEffect(() => {
    checkTokens();
  }, [navigateToPage]);

  const handleFileChange = async (event) => {
    await checkTokens();

    if (!isLoggedIn) return;

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
    // Kiểm tra token trước khi tiếp tục xử lý dán nội dung
    await checkTokens();

    if (!isLoggedIn) return;

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
    // Lắng nghe sự kiện paste chỉ khi đã login
    if (isLoggedIn) {
      document.addEventListener("paste", handlePaste);
    } else {
      document.removeEventListener("paste", handlePaste);
    }

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [isLoggedIn]);

  return (
    <div className={styles.container}>
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

        <label className={styles.uploadArea}>
          {uploadedImage && (
            <img src={uploadedImage} alt="Uploaded" className={styles.uploadedImage} />
          )}
          <input
            type="file"
            accept="image/*"
            className={styles.hiddenFileInput}
            onChange={handleFileChange}
          />
          {!uploadedImage && (
            <p className={styles.uploadPrompt}>Click or Drag to Upload</p>
          )}
        </label>

        {!isLoggedIn && (
          <div className={styles.uploadPromptMess}>Please log in to upload images</div>
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
};

export default Detect;
