"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Redirect() {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTokens = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/tokens`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }

        const data = await response.json();
        const expirationTime = Date.now() + 300000; // Token expiration time (5 minutes)

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("expiration", expirationTime.toString());

        toast.success("Login successful!");

        // Chuyển hướng người dùng về trang chủ
        window.location.href = '/'; // Trang chủ ứng dụng của bạn
      } catch (error) {
        console.error("Error:", error);
        toast.error("Login failed. Please try again.");
      }
    };

    fetchTokens();
  }, []);

  return null;
}
