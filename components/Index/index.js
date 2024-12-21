import React, { useState, useEffect } from "react";
import styles from '../../styles/Pages.module.css';
import { useWebsocket } from "../../hooks/user-websocket";

const Detect = ({ navigateToPage }) => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    const checkTokens = async () => {
      chrome.storage.local.get(['accessToken', 'expirationTime', 'refreshToken'], async (result) => {
        const { accessToken, expirationTime, refreshToken } = result;

        if (accessToken && refreshToken && expirationTime) {
          const currentTime = Date.now();
          const expiration = parseInt(expirationTime, 10);

          if (currentTime < expiration) {
            setIsLoggedIn(true);
            setToken(accessToken);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
          // if (navigateToPage) {
          //   navigateToPage("login");
          // }
        }
      });
    };

    checkTokens();
  }, [navigateToPage]);

  const { ready, ws, val, send } = useWebsocket({ 
    url: "wss://pbl6.site/ws", 
    token: token || "" 
  });

  useEffect(() => {
    if (ready && ws) {
      ws.onmessage = (event) => {
        setIsLoading(false);
        const message = JSON.parse(event.data);
        
        setUploadedImage(message.image_url);
        const predictionType = message.prediction.type;
        const confidencePercentage = message.prediction.confidence_percentage;

        const confidencePercentageValue = parseFloat(confidencePercentage.replace('%', ''));
        let calculatedConfidenceScore;
        if (predictionType === "Real") {
          calculatedConfidenceScore = 100 - confidencePercentageValue;
        } else {
          calculatedConfidenceScore = confidencePercentageValue;
        }
        setConfidenceScore(`${calculatedConfidenceScore}%`);
        setAnalysisResult(predictionType);

        // setUploadedImage(message.image_url);
        // setAnalysisResult(message.prediction.type);
        // setConfidenceScore(message.prediction.confidence_percentage);
      };

      ws.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        setIsLoading(false);

        const reconnectWebSocket = () => {
          console.log("Reconnecting...");
          const socket = new WebSocket("wss://pbl6.site/ws", ["Token", token]);

          socket.onopen = () => {
            console.log("WebSocket Reconnected");
          };

          socket.onclose = () => {
            console.log("WebSocket closed again, attempting to reconnect...");
            setTimeout(reconnectWebSocket, 5000);
          };

          socket.onmessage = (event) => {
            console.log(event.data);
          };
        };

        reconnectWebSocket();
      };
    }
  }, [ready, ws, token]);

  const getMimeType = (file) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return `image/${fileExtension}`;
  };

  const uploadAndPredict = async (file, mimeType) => {
    setIsLoading(true);
  
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['accessToken'], (res) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(res);
        });
      });
  
      if (!result.accessToken) {
        throw new Error("Missing access token");
      }
      const accessToken = result.accessToken;
  
      // Fetch signed URL
      const signedUrlResponse = await fetch(`${apiUrl}/files/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ mime_type: mimeType }),
      });
  
      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed URL");
      }
  
      const { upload_url, file_url } = await signedUrlResponse.json();
      setUploadedImage(file_url);
  
      // Upload file
      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        body: file,
      });
  
      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }
  
      // Predict
      const key_result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['apiKey'], (res) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(res);
        });
      });
  
      const predictionsResponse = await fetch(`${apiUrl}/predictions`, {
        method: 'POST',
        body: JSON.stringify({ image_url: file_url }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': key_result.apiKey,
        },
      });
  
      if (!predictionsResponse.ok) {
        throw new Error("Prediction request failed");
      }
  
    } catch (error) {
      console.log(error.message || "Error processing file");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFileChange = async (e) => {
    if (!isLoggedIn) {
      navigateToPage("login");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const mimeType = getMimeType(file);
      await uploadAndPredict(file, mimeType);
    } catch (error) {
      console.log(error.message || "Error processing file");
    }
  };

  const handlePaste = async (event) => {
    if (!isLoggedIn) {
      navigateToPage("login");
      return;
    }
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (!file) continue;

        try {
          const mimeType = getMimeType(file);
          await uploadAndPredict(file, mimeType);
        } catch (error) {
          console.log(error.message || "Error processing pasted image");
        }
        break;
      }
    }
  };

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
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.loader}></div>
              <p>Loading...</p>
            </div>
          )}
          {!isLoading && uploadedImage && (
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
