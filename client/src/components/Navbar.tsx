'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FC, useState } from 'react';
import { FiMenu, FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const Navbar: FC = () => {
  const authContext = useAuthContext();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onClickLogout = () => {
    setMenuOpen(false);
    authContext.logout();
  };

  return (
    <nav className="sticky top-0 z-10 bg-black shadow-md text-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* Hamburger Menu (Mobile) */}
          {authContext.isAuthenticated && (
            <button
              onClick={toggleMenu}
              className="text-2xl md:hidden focus:outline-none mr-4"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <IoClose /> : <FiMenu />}
            </button>
          )}

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold"
            onClick={() => setMenuOpen(false)}
          >
            HABITS TOGETHER
          </Link>
        </div>

        {/* Show additional items only if authenticated */}
        {authContext.isAuthenticated && (
          <div className="flex items-center space-x-4">
            {/* Menu Links (Desktop) */}
            <div className="hidden md:flex space-x-4">
              <Link href="/profile">Perfil</Link>
              <Link href="/habits">Hábitos</Link>
              <Link href="/friends">Amigos</Link>
              <button onClick={onClickLogout}>Cerrar Sesión</button>
            </div>

            {/* Plus Icon Button */}
            <Link href="/logs/new">
              <button
                className="text-2xl focus:outline-none"
                aria-label="Add New"
              >
                <FiPlus />
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && authContext.isAuthenticated && (
        <div className="md:hidden">
          <ul className="bg-black py-4 px-6 space-y-4">
            <li>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                Perfil
              </Link>
            </li>
            <li>
              <Link href="/habits" onClick={() => setMenuOpen(false)}>
                Hábitos
              </Link>
            </li>
            <li>
              <Link href="/friends" onClick={() => setMenuOpen(false)}>
                Amigos
              </Link>
            </li>
            <li>
              <button onClick={onClickLogout}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
