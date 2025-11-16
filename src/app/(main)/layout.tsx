'use client'
import { useEffect } from "react"
import Navbar from "../components/Navbar"
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { userAuth, loading } = useAuth();

  useEffect(() => {
    if (!userAuth && !loading) {
      router.push('/login');
    }
  }, [userAuth, loading, router]);

  if (loading) return <div>Loading...</div>; // รอโหลดเสร็จ

  return (
    <>
      <header>
        <Navbar />
      </header>
      {children}
    </>
  );
}

export default MainLayout;
