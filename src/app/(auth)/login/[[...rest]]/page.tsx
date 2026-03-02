import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
     <div className='auth-wrapp'>
        {/* <div className="auth-wrapp-top mt-3">
            <Link href={'/login'} className='flex w-full'>
              <button className='auth-active auth_btn' >
                  Login
              </button>
            </Link>
            <Link href={'/signup'} className='flex w-full'>
              <button className='auth_btn'>
                  Sign Up
              </button>
            </Link>
        </div>
        <div className="auth-wrapp-container">
            <div className="auth-wrapp-content">
                <h3>Email</h3>
                <input type="email" required />
            </div>
            <div className="auth-wrapp-content">
                <h3>Password</h3>
                <input type="password" required />
            </div>
            <div className="remember text-sm">
                <div className="remember-left flex  borde-none gap-1">
                    <input type='checkbox' className='cursor-pointer items-center h-4 w-4 outline-none'/>
                    <p>Remember Me</p>
                </div>
                <button className='cursor-pointer decoration-1'>
                    Forgot password?
                </button>
            </div>
            <button className='signin-btn'>Login</button>
        </div> */}
        <SignIn afterSignInUrl="/dashboard" />
    </div>
  )
}

export default page