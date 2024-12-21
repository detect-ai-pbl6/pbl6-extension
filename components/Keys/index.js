import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from '../../styles/Keys.module.css';

export default function Keys({ navigateToPage }) {
  const [apiKeyType, setApiKeyType] = useState("free_tier");
  const [apiKeys, setApiKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [hasMore, setHasMore] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      const access_result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['accessToken'], (res) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(res);
        });
      });
      console.log("fetchApiKeys accessToken: ", access_result.accessToken);
      const response = await fetch(`${apiUrl}/api-keys?page=${currentPage}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_result.accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data.results);
      setHasMore(data.results.length === limit);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [currentPage, limit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access_result = await new Promise((resolve, reject) => {
      chrome.storage.local.get(['accessToken'], (res) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(res);
      });
    });
    if (!access_result.accessToken) {
      toast.error("Access token is missing");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_result.accessToken}`,
        },
        body: JSON.stringify({
          api_key_type: apiKeyType,
          is_default: true,
        }),
      });

      if (response.ok) {
        toast.success("API Key created successfully!");
        fetchApiKeys();
      } else {
        toast.error("Failed to create API Key");
      }
    } catch (error) {
      toast.error("Error creating API Key");
    }
  };

  const handleDelete = async (id) => {
    const access_result = await new Promise((resolve, reject) => {
      chrome.storage.local.get(['accessToken'], (res) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(res);
      });
    });
    
    if (!access_result.accessToken) {
      toast.error("Access token is missing");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api-keys/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_result.accessToken}`,
        },
      });

      if (response.ok) {
        toast.success("API Key deleted successfully!");
        fetchApiKeys();
      } else {
        toast.error("Failed to delete API Key");
      }
    } catch (error) {
      toast.error("Error deleting API Key");
    }
  };

  const handleUpdate = async (id, isDefault) => {
    const access_result = await new Promise((resolve, reject) => {
      chrome.storage.local.get(['accessToken'], (res) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(res);
      });
    });
    if (!access_result.accessToken) {
      toast.error("Access token is missing");
      return;
    }

    const updatedIsDefault = !isDefault;

    try {
      const response = await fetch(`${apiUrl}/api-keys/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_result.accessToken}`,
        },
        body: JSON.stringify({ is_default: updatedIsDefault }),
      });

      if (response.ok) {
        fetchApiKeys();
        toast.success("API Key updated successfully!");
      } else {
        toast.error("Failed to update API Key");
      }
    } catch (error) {
      toast.error("Error updating API Key");
    }
  };

  const handleNextPage = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


  return (
    <div className={styles.container}>
      <h1 className={styles["title"]}>Create API Key</h1>
      <form onSubmit={handleSubmit} className={styles["form"]}>
        <label className={styles["label"]}>
          API Key Type:
          <select
            value={apiKeyType}
            onChange={(e) => setApiKeyType(e.target.value)}
            className={styles["select"]}
          >
            <option value="free_tier">Free Tier</option>
            <option value="enterprise_tier">Enterprise Tier</option>
            <option value="custom_tier">Custom Tier</option>
          </select>
        </label>
        <button type="submit" className={styles["button-submit"]}>
          Create API Key
        </button>
      </form>

      <h2 className={styles["subtitle"]}>Existing API Keys</h2>
      <div className={styles["table-container"]}>
        <table className={styles["table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Key</th>
              <th>Type</th>
              <th>Default</th>
              <th>Max Usage</th>
              <th>Total Usage</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td>{key.id}</td>
                <td>{key.api_key}</td>
                <td>{key.api_key_type}</td>
                <td>
                  <span style={{ fontWeight: key.is_default ? 'bold' : 'normal' }}>
                    {key.is_default ? "Yes" : "No"}
                  </span>
                </td>
                <td>{key.maximum_usage}</td>
                <td>{key.total_usage}</td>
                <td>{new Date(key.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleUpdate(key.id, key.is_default)}
                    className={`${styles.button} ${styles.update}`}
                    disabled={key.total_usage >= key.maximum_usage}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(key.id)}
                    className={`${styles.button} ${styles.delete}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles["pagination"]}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={styles["pagination-button"]}
        >
          Prev
        </button>
        <button 
          onClick={handleNextPage}
          disabled={!hasMore}
          className={styles["pagination-button"]}>
          Next
        </button>
      </div>
    </div>
  );
}
