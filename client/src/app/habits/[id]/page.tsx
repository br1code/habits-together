'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import Link from 'next/link';

// TODO
const ViewHabitPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="text-center">
      <h1 className="font-bold text-2xl">PAGINA EN CONSTRUCCIÓN</h1>
      <h2>Viendo Hábito con Id {id}</h2>
      <Link href={`/habits/${id}/edit`}>
        <button className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-white font-semibold transition">
          Editar Hábito
        </button>
      </Link>
    </main>
  );
};

export default withAuth(ViewHabitPage);
