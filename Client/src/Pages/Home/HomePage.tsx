"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'

export default function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/dashboard", { replace: true })
    } else {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  return (
    <div className='flex justify-center items-center h-screen bg-slate-950 text-white'>
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        <p className="text-slate-400 text-sm font-medium">Redirecting you to your workspace...</p>
      </div>
    </div>
  );
}