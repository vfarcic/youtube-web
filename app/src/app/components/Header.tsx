'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  
  const navigationItems = [
    { href: '/', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { href: '/videos', icon: 'fas fa-video', label: 'Video List' },
    { href: '/create', icon: 'fas fa-plus-circle', label: 'Create Video' },
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <Link href="/" className="logo-link">
            <Image
              src="/img/logo-wide-transparent.png"
              alt="YouTube Automation Platform"
              width={240}
              height={60}
              className="logo"
              priority
            />
          </Link>
        </div>
        {/* Navigation Tabs moved to header */}
        <nav className="header-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`tab-btn ${pathname === item.href ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {/* Future: Add user actions here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
