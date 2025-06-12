import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { clear, clearAllCookies } from "@/helpers/localStorage";
// import { signOut } from "next-auth/react";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      setLoading(true);
      try {
        // Clear all cookies and local storage
        clearAllCookies();
        clear();
        
        // Clear user context
        
        // Sign out from next-auth
        // await signOut({ redirect: false });
        
        // Redirect to login page
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setLoading(false);
      }
    };

    handleLogout();
  }, []);

  return (
    <div>
      {loading && (
        <div style={{ 
          height: "100vh", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center" 
        }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Logout;
