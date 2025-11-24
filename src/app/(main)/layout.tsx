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

  if (loading) return <div className="flex flex-col items-center gap-2 justify-center h-screen text-xl">
    <div>Loading...</div>
    {/* <div><Link href="/login" className="link link-hover text-primary">Go to Login</Link></div> */}
  </div>

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
