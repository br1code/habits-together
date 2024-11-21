'use client';

import Link from 'next/link';
import { FC, useState } from 'react';
import { FiMenu, FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const Navbar: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="sticky top-0 z-10 bg-black shadow-md text-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={toggleMenu}
            className="text-2xl md:hidden focus:outline-none mr-4"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <IoClose /> : <FiMenu />}
          </button>

          {/* Home Link */}
          <Link href="/" className="text-lg font-bold">
            HABITS TOGETHER
          </Link>
        </div>

        {/* Desktop Menu Links and Plus Icon */}
        <div className="flex items-center space-x-4">
          {/* Menu Links (Desktop) */}
          <div className="hidden md:flex space-x-4">
            <Link href="/profile">Perfil</Link>
            <Link href="/habits">Hábitos</Link>
            <Link href="/friends">Amigos</Link>
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
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
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
