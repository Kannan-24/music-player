"use client"

import Image from "next/image"
import { X } from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
  isMobile: boolean // New prop
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose, isMobile }: SidebarProps) {
  const menuItems = [{ name: "For You" }, { name: "Top Tracks" }, { name: "Favourites" }, { name: "Recently Played" }]

  return (
    <div className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <div>
        <div className="sidebar-header">
          <div className="logo">
            <Image src="/Logo.svg" alt="Spotify Logo" width={98} height={98} /> {/* Made logo larger */}
            {/* Removed <span>Spotify</span> */}
          </div>
          {isMobile && ( // Conditionally render close button only on mobile
            <button className="close-sidebar" onClick={onClose}>
              <X size={24} />
            </button>
          )}
          
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activeTab === item.name ? "active" : ""}`}
              onClick={() => {
                onTabChange(item.name)
                onClose()
              }}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="profile-section">
        <img src="/profile.png" alt="User Profile" className="profile-image" />
        {/* Removed <span className="profile-name">John Doe</span> */}
      </div>

      
       
   </div>
  )
}
