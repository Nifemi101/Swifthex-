import { useState, useEffect } from "react";
import { fetchUser } from "../service/api";
import { mockUser } from "../data/mockData";
import type { User } from "../types";

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchUser();
        setUser(data);
      } catch (err) {
        // API unavailable — fall back to mock data in development
        console.warn("useUser: API unavailable, using mock data", err);
        setUser(mockUser);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, error };
};

export default useUser;
