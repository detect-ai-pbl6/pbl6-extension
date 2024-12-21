import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "../../styles/History.module.css";

export default function History({ navigateToPage }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [hasMore, setHasMore] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch history items
  const fetchHistory = async () => {
    try {
      const access_result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["accessToken"], (res) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          resolve(res);
        });
      });
      const response = await fetch(`${apiUrl}/history?page=${currentPage}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_result.accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch history");

      const data = await response.json();
      setHistoryItems(data.results);
      setHasMore(data.results.length === limit);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage, limit]);

  const handleNextPage = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className={styles.container}>
      <h1 className={styles["title"]}>History</h1>
      <div className={styles["table-container"]}>
        <table className={styles["table"]}>
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Prediction Type</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Created At</th>
          </tr>
          </thead>
          <tbody>
            {historyItems.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">
                    <img src={item.results.image_url} alt="Prediction" className={`${styles.image}`} />
                </td>
                <td className="border px-4 py-2">{item.results.prediction.type}</td>
                <td className="border px-4 py-2">{item.results.status}</td>
                <td className="border px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
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
          className={styles["pagination-button"]}
        >
          Next
        </button>
      </div>
    </div>
  );
}
