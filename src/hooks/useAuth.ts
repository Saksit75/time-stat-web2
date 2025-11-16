'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
type UserAuth = {
  userId: number;
  username: string;
  role: string;
};

export function useAuth() {
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('/api/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const data = res.data.data;
        if (data?.userId) {
          setUserAuth({
            userId: data.userId,
            username: data.userName,
            role: data.userRole,
          });
        } else {
          setUserAuth(null);
        }
      } catch (err) {
        setUserAuth(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { userAuth, loading };
}
