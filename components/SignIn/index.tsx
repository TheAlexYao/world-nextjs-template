"use client";
import { signIn } from "next-auth/react";

export const SignIn = () => {
  const handleSignIn = async () => {
    try {
      console.log('Starting World ID sign in...');
      const result = await signIn('worldcoin', { 
        redirect: true,
        callbackUrl: '/chat'
      });
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 24.2843 7.71573 31 16 31ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"/>
        <path d="M16 27C22.0751 27 27 22.0751 27 16C27 9.92487 22.0751 5 16 5C9.92487 5 5 9.92487 5 16C5 22.0751 9.92487 27 16 27Z" fill="#00B4B6"/>
      </svg>
      Sign in with World ID
    </button>
  );
};

