"use client";
import InvestLeft from "@/component/InvestLeft";
import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";

const RootLayout = ({children}:{children: ReactNode}) => {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  return (
    <main className="invest">
      <div className="invest-nav">
        <button 
          className="mobile-nav-toggle"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
          <FaBars className="invers-bar" />
        </button>
      </div>
      <div className="invest-container">
        {/* Mobile Navigation Toggle Button */}
        
        <div className={`invest-left ${isMobileNavOpen ? 'mobile-open' : ''}`}>
          <InvestLeft 
            currentPath={pathname} 
            onMobileNavClose={() => setIsMobileNavOpen(false)}
          />
        </div>
        
        {/* Overlay for mobile */}
        {isMobileNavOpen && (
          <div 
            className="mobile-nav-overlay"
            onClick={() => setIsMobileNavOpen(false)}
          ></div>
        )}
        
        <div className="invest-right">
            {children}
        </div>
      </div>
    </main>
  )
}

export default RootLayout