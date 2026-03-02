import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
        <div className='auth-wrapp'>
            {/* <div className="auth-wrapp-top mt-3">
                <Link href={'/login'} className='flex w-full'>
                <button className='auth_btn' >
                    Login
                </button>
                </Link>
                <Link href={'/signup'} className='flex w-full'>
                <button className='auth_btn auth-active'>
                    Sign Up
                </button>
                </Link>
            </div> */}
            {/* <div className="auth-wrapp-container">
                <div className="auth-reg flex gap-2">
                    <div className="auth-wrapp-content">
                        <h3>First Name</h3>
                        <input type="email" required />
                    </div>
                    <div className="auth-wrapp-content">
                        <h3>Last Name</h3>
                        <input type="email" required />
                    </div>
                </div>
                <div className="auth-wrapp-content">
                    <h3>Email</h3>
                    <input type="email" required />
                </div>
                <div className="auth-wrapp-content">
                    <h3>Password</h3>
                    <input type="password" required />
                </div>
                <div className="auth-reg auth-wrapp-content">
                    <h3>Confirm Password</h3>
                    <input type="password" required />
                </div>
                <div className="remember text-sm">
                    <div className="remember-left flex  borde-none gap-1">
                        <input type='checkbox' className='cursor-pointer items-center h-4 w-4 outline-none'/>
                        <p>I agree to the Terms of Service and Privacy Policy</p>
                    </div>
                </div>
                <button className='signin-btn'>Sign Up</button>
            </div> */}
            <SignUp afterSignUpUrl="/dashboard" />
        </div>
    </>
  )
}

export default page