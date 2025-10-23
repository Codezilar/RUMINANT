"use client"
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import editors from '@/app/assets/editor.webp'
import copywriter from '@/app/assets/copywriter.webp'
import developer from '@/app/assets/developer.webp'
import startup from '@/app/assets/startup.webp'

import leftHand from '@/app/assets/hand (1).png'
import rightHand from '@/app/assets/hand.png'
import { GlobeDemo } from './Globe';




const Hero = () => {
  return (
    <div className="home">
      <div className="hero">
          <div className="home-hero">
            <div className="home-hero-left hero-suspend">
              <div className="home-fly fly-1">
                <Image className="hero-image" height={40} width={40} src={editors} alt="fly" />
                <p className=""> Proven Track Record</p>
              </div>
              <div className="home-fly fly2">
                <Image className="hero-image" height={40} width={40} src={copywriter} alt="fly" />
                <p className="">Transparent Performance</p>
              </div>
              <div className="home-fly fly5">
                <Image className="hero-image" height={40} width={40} src={copywriter} alt="fly" />
                <p className="">Expert-Vetted Opportunitiess</p>
              </div>
              <div className="home-fly fly6">
                <Image className="hero-image" height={40} width={40} src={copywriter} alt="fly" />
                <p className="">Secure & Compliant</p>
              </div>
              <div className="home-fly fly9">
                <Image className="hero-image" height={40} width={40} src={copywriter} alt="fly" />
                <p className="">Dedicated Support</p>
              </div>
            </div>
            <div className="home-hero-center">
              <span className="theme-gradient">Welcome to Kingadox Bank</span>
              <h2 className="">
                Experience the future of banking with our secure <span>innovative,</span> and <span>user-friendly platform</span> designed for modern financial needs.
              </h2>
              <Link className="hero_link" href={'/signup'}>Get Started</Link>
            </div>
            <div className="home-hero-right hero-suspend">
              <div className="home-fly fly3">
                <Image className="hero-image" height={40} width={40} src={developer} alt="fly" />
                <p className="">Trusted by Thousands</p>
              </div>
              <div className="home-fly fly4">
                <Image className="hero-image" height={40} width={40} src={developer} alt="fly" />
                <p className="">Consistent Returns</p>
              </div>
              <div className="home-fly fly7">
                <Image className="hero-image" height={40} width={40} src={startup} alt="fly" />
                <p className="">Curated Investment Options</p>
              </div>
              <div className="home-fly fly8">
                <Image className="hero-image" height={40} width={40} src={startup} alt="fly" />
                <p className="">Seamless User Experience</p>
              </div>
              <div className="home-fly fly10">
                <Image className="hero-image" height={40} width={40} src={startup} alt="fly" />
                <p className="">Insights That Empower</p>
              </div>
            </div>
          </div>
          <div className="user-area">
              <p className="">
                Join Over 10,000+ Investors Seeing Strong Returns
              </p>
              <div className="avatar-container">
                <div className="avatar">
                  <Image className='avatar-img' src={'/top.png'} height={40} width={40} alt='avatar' />
                </div>
                <div className="avatar avatar1 ava-color1">
                  <Image className='avatar-img' src={'/sol.png'} height={40} width={40} alt='avatar' />
                </div>
                <div className="avatar avatar1 ava-color2">
                  <Image className='avatar-img' src={'/bnb.webp'} height={40} width={40} alt='avatar' />
                </div>
                <div className="avatar avatar1 ava-color3">
                  <Image className='avatar-img' src={'/usdt.png'} height={40} width={40} alt='avatar' />
                </div>
                <div className="avatar avatar1 ava-color4">
                  <Image className='avatar-img' src={'/eth.webp'} height={40} width={40} alt='avatar' />
                </div>
                <div className="avatar avatar1 ava-color5">
                  <Image className='avatar-img' src={'/btc.png'} height={40} width={40} alt='avatar' />
                </div>
          
              </div>
          </div>
          <div className="laptop">
            <GlobeDemo />
            <div className="hands">
              <Image height={575} width={231} src={leftHand} alt="hand" className="left" />
              <Image height={575} width={231} src={rightHand} alt="hand" className="right" />
            </div>
          </div>
      </div>
    </div>
  )
}

export default Hero