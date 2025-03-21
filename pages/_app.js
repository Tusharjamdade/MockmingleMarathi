// import "@/styles/globals.css";
// import { useState,useEffect } from "react";
// import { useRouter } from "next/router";


// export default function App({ Component, pageProps }) {
//   const [user, setUser] = useState({ value: null });
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setUser({ value: token });
//     }

//   }, [router.query]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser({ value: null });
//     router.push('/');
//   };
//   return <Component {...pageProps} Logout={logout} user={user} />;
// }


import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import AdminNav from "@/components/adminNav";



export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({ value: null });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ value: token });
    }

  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ value: null });
    router.push('/');
  };
  const isAdminRoute = router.pathname.startsWith('/admin');

  return<>
 {isAdminRoute ?  <div className="flex min-h-screen bg-cover" style={{ backgroundImage: "url('/bg.jpg')" }}>
 <AdminNav /> 
 <Component {...pageProps} user={user} Logout={logout} />
 </div> : ''}
 
   {!isAdminRoute ? <Component {...pageProps} user={user} Logout={logout} />:''}
  </>
}
