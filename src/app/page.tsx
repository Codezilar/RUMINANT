"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import Choose from '@/component/Choose';
import Footer from '@/component/Footer';
import Hero from '@/component/Hero';
import Transform from '@/component/Transform';

export default function Page() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = "/dashboard"; // full reload redirect
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return null; // avoid flashing the homepage content
  }

  return (
    <div>
      <Hero />
      <Choose />
      <Transform />
      <Footer />
    </div>
  );
}
