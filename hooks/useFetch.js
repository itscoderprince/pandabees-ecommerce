import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

/**
 * Custom hook to handle API requests efficiently.
 * 
 * WHY THE OLD CODE WASN'T WORKING:
 * 1. Typo: Naming it 'uesFetch' instead of 'useFetch'.
 * 2. Never Called: The apiCall function inside useEffect was defined but NEVER executed.
 * 3. Scope: Important variables like requestOptions were returning 'undefined' because return statements were missing.
 * 4. Error Handling: Error messages were caught but never saved to the 'error' state, so the UI wouldn't know.
 * 5. Return Statement: The hook itself wasn't returning any data ({ data, loading, error }), making it impossible to use in a component.
 */

const useFetch = (url, method = "GET", options = {}) => {
  // --- 1. STATE INITIALIZATION ---
  const [data, setData] = useState(null);       // Stores the API response
  const [loading, setLoading] = useState(false);   // Loading status for UI spinners
  const [error, setError] = useState(null);       // Stores error messages if the request fails

  // --- 2. MANAGING DEPENDENCIES ---
  // We use a Ref for 'options' because if the user passes an object literal like {}, 
  // it creates a NEW reference on every render, which usually causes infinite loops in useEffect.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // --- 3. THE CORE FETCHING ENGINE ---
  // useCallback memoizes the function to prevent it being recreated on every render.
  const fetchData = useCallback(
    async (manualData = null) => {
      // Safety check: Exit if URL is missing
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        // Execute the request using Axios
        const response = await axios({
          url,
          method,
          ...optionsRef.current,
          // If manualData is passed (like in a form submit), we use it; otherwise use default data.
          data: manualData || optionsRef.current.data,
        });

        // --- 4. SUCCESS HANDLING ---
        // Checks your project's helper format: { success: boolean, message: string, data: [...] }
        if (response.data && response.data.success === false) {
          throw new Error(response.data.message || "Request failed on server");
        }

        setData(response.data); // Save the response payload
        return response.data;
      } catch (err) {
        // --- 5. ERROR HANDLING ---
        // Clean up error messages from Axios or custom server errors
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
        
        console.error(`useFetch Error [${method} ${url}]:`, err);
        throw err; // Re-throw so the component can handle it if needed
      } finally {
        // Always stop loading, regardless of success or failure
        setLoading(false);
      }
    },
    [url, method], // Only recreate if URL or Method changes
  );

  // --- 6. AUTOMATION ---
  // This automatically fetches data when the component mounts, IF it's a 'GET' request.
  useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [fetchData, method]);

  // --- 7. EXPOSING THE API ---
  return {
    data,       // The fetched data
    loading,    // To show "Loading..." text
    error,      // To show "Error: ..." messages
    refetch: fetchData, // Allows manual triggers (e.g. on button click)
    setData,    // Allows manual state updates (e.g. after local edits)
  };
};

export default useFetch;
