'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders navigation after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const links = [
    { href: '/welcome', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/marketplace', label: 'Market Place' }
  ];

  return (
    <header
      className={`sticky top-0 mb-2 flex items-center justify-between border px-6 py-4 shadow`}
    >
      {/* Logo */}
      <div className='ms-[30px] flex items-center space-x-2'>
        <Image
          src='/logo.png'
          alt='Description of the image'
          width={50}
          height={50}
        />
      </div>

      {/* Nav links - only show after client hydration */}
      {isClient && (
        <nav
          className={`${!userId ? 'md:hidden' : ''} ms-[-30px] hidden gap-8 font-semibold md:flex`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'text-blue-600' : ''}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Share/Login button */}
      {isClient ? (
        userId ? (
          <button className='flex gap-2 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white'>
            <div>Share</div>
            <Icons.share size={16} strokeWidth={0.85} />
          </button>
        ) : (
          <button className='flex gap-2 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white'>
            <div>Log In</div>
          </button>
        )
      ) : (
        // Fallback button during SSR
        <button className='flex gap-2 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white'>
          <div>Log In</div>
        </button>
      )}
    </header>
  );
}
