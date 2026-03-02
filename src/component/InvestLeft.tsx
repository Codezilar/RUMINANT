"use client"
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { useUser } from '@clerk/nextjs';
import { FaTimes } from "react-icons/fa";

interface InvestLeftProps {
  currentPath?: string;
  onMobileNavClose?: () => void;
}

const InvestLeft = ({ currentPath, onMobileNavClose }: InvestLeftProps) => {
  const isActive = (path: string) => currentPath?.includes(path);
  const { user } = useUser();
  
  const handleLinkClick = () => {
    // Close mobile navigation when a link is clicked
    if (onMobileNavClose) {
      onMobileNavClose();
    }
  };
  
  return (
    <div className='invest_profile'>
      {/* Mobile Close Button */}
      <button className="mobile-close-btn" onClick={onMobileNavClose}>
        <FaTimes />
      </button>
      
      <div className="invest_profile_top">
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: '150px',
                height: '150px'
              }
            }
          }}
        />
        <h2>{user?.fullName || 'User'}</h2>
        <p>New York</p>
      </div>
      <div className="invest_profile_content">
        <Link href={'/dashboard'} onClick={handleLinkClick}>
          <button className={isActive('/dashboard') ? 'active' : ''}>
            Dashboard
          </button>
        </Link>
        <Link href={'/investdeposit'} onClick={handleLinkClick}>
          <button className={isActive('/investdeposit') ? 'active' : ''}>
            Deposit Investment
          </button>
        </Link>
        <Link href={'/mortgage'} onClick={handleLinkClick}>
          <button className={isActive('/mortgage') ? 'active' : ''}>
            Request Mortgage
          </button>
        </Link>
        <Link href={'/properties'} onClick={handleLinkClick}>
          <button className={isActive('/properties') ? 'active' : ''}>
            Invest In Properties
          </button>
        </Link>
        <Link href={'/containers'} onClick={handleLinkClick}>
          <button className={isActive('/containers') ? 'active' : ''}>
            Invest In Containers
          </button>
        </Link>
      </div>
    </div>
  )
}

export default InvestLeft