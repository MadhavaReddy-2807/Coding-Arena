"use client"
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons for toggle
import { motion } from "framer-motion"; // Smooth animations
import { Button } from "./ui/button";
import { UserButton,SignInButton,useAuth } from "@clerk/nextjs";

export default function Header() {
  const {isSignedIn}=useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference for the sidebar

  // Function to close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Navigation Bar */}
      <header className="bg-blue-600 shadow-sm shadow-blue-300 py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Button */}
          {/* <button
            onClick={() => setIsOpen(true)}
            className="text-white focus:outline-none"
          >
            <Menu size={28} />
          </button> */}

          {/* Logo */}
          <h1 className="text-2xl font-bold text-white hidden md:block">CP Arena</h1>
        </div>

        {/* Right Side: Dashboard */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-gray-200 font-medium" >Home</Link>
          <Link href="/dashboard" className="text-white hover:text-gray-200 font-medium">
            Dashboard
          </Link>
          <div>
              {isSignedIn?(<UserButton/>):<SignInButton><Button>Login</Button></SignInButton>}
         </div>
        </div>
         
      </header>

      {/* Sidebar + Background Overlay */}
      {isOpen && (
        <>
          {/* Background Overlay (Clicking it closes the sidebar) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black transition-opacity"
          />

          {/* Sidebar Menu (Sliding from the left) */}
          <motion.div
            ref={sidebarRef} // Attach ref to sidebar
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-50"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-800"
            >
              <X size={28} />
            </button>

            {/* Sidebar Links */}
            <nav className="mt-10 space-y-4 flex justify-center">
              <Link
                href="/CostumContests"
                className=" text-gray-800 hover:bg-gray-200 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <Button variant='ghost' className='border flex justify-center'>Custom Contest</Button>
              </Link>
              
            </nav>
          </motion.div>
        </>
      )}
    </>
  );
}
