import toast from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh");

  if (refreshToken) {
    try {
      const response = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || "Failed to refresh access token";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const newExpirationTime = Date.now() + 300000;
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("expiration", newExpirationTime.toString());

      toast.success("Access token refreshed successfully");
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to refresh access token");
      return false;
    }
  } else {
    toast.error("No refresh token available");
    return false;
  }
};
