'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

export default function NavBar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  const links = [
    { href: '/welcome', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/marketplace', label: 'Market Place' }
    // { href: '/products', label: 'Products' }
  ];

  return (
    <header
      className={` ${!userId ? 'hidden' : ''} sticky top-0 mb-2 flex items-center justify-between border px-6 py-5 shadow`}
    >
      {/* Logo */}
      <div className='ms-[30px] flex items-center space-x-2'>
        {/* <Link className='ms-[30px] text-xl font-thin' href='/'>
          Resume AI
        </Link> */}
        <Image
          src='/logo.png'
          alt='Description of the image'
          width={50}
          height={50}
        />
      </div>
      {/* <img src='/logo.png' alt='' className='h-8 w-auto' /> */}

      {/* Nav links */}
      <nav className='ms-[-30px] hidden gap-8 font-semibold md:flex'>
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

      {/* Share button */}
      <button className='flex gap-2 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white'>
        <div>Share</div>
        <Icons.share size={16} strokeWidth={0.85} />
      </button>
    </header>
  );
}
