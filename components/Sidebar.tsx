'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Footer from './Footer';
import { useAtom } from 'jotai';
import { userLoggedAtom } from '@/store';

const Sidebar = ({ user }: SiderbarProps) => {
  const pathName = usePathname();
  const [userLogged, setUserLogged] = useAtom(userLoggedAtom);

  const isDashboard = pathName === '/dashboard';

  useEffect(() => {
    if (user) {
      setUserLogged(user);
    }
  }, [user])

  return (
    <section className={`fixed z-50 border-b-2 h-20 bg-white transition-all duration-100 ${cn(!isDashboard && 'sidebar', { 'topbar w-full h-16': isDashboard, 'fixed top-0 left-0 w-64': !isDashboard })}`}>
      <nav className={cn('flex', { 'flex-row items-center gap-6 p-4': isDashboard, 'flex-col gap-4': !isDashboard })}>
        <Link href="/" className={cn('cursor-pointer items-center gap-2', { 'mb-0': isDashboard, 'mb-10': !isDashboard })}>
          <div className='flex gap-2 items-center justify-evenly'>
            <Image
              src="/plasson-logo.png"
              alt="Plasson logo"
              width={70}
              height={20}
            />
            <span className="text-[#00107a] font-bold text-lg font-inter">DASHYO</span>
          </div>

        </Link>

        {sidebarLinks.map((item) => {
          // Pular o link "Gerenciar acesso" se o user.role não for "admin"
          if (user.role !== 'admin' && item.label === 'Gerenciar acesso') {
            return null;
          }

          const isActive = pathName === item.route;

          return (
            <Link
              className={cn('sidebar-link', { 'bg-[#00107a]': isActive, 'topbar-link': isDashboard })}
              href={item.route}
              key={item.label}
            >
              <div className={cn('relative size-6', { 'topbar-icon': isDashboard })}>
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  style={isActive && { filter: 'invert(1)' }}
                />
              </div>
              <p className={cn('sidebar-label', { '!text-white': isActive, 'flex': isActive, 'topbar-label': isDashboard })}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>

      {!isDashboard && <Footer user={user} />} {/* O Footer não aparece na Topbar */}
    </section>
  );
};

export default Sidebar;
