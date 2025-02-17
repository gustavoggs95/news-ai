import axios from "axios";

const fluxApi = axios.create();

fluxApi.interceptors.request.use(
  async (config) => {
    // Check if we are in a browser (client-side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // We are on the server; retrieve the token from cookies.
      // Using Next.js 13+ server components with next/headers:
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;
        console.log("token", token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error retrieving auth token from cookies:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default fluxApi;
