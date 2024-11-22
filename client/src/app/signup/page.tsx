'use client';

import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import withoutAuth from '@/components/withoutAuth';
import { signup } from '@/api';

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
}

const SignupPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignupFormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      await signup(data);
      alert('Tu cuenta ha sido creada. Ya puedes iniciar sesión');
      router.push('/login');
    } catch (error) {
      console.log('An error occured during signup', error);
      alert('Error al registrarse. Por favor intente de nuevo.');
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Nuevo Usuario</h1>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Nombre de Usuario
          </label>
          <input
            id="username"
            type="text"
            className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
            {...register('username', {
              required: 'El nombre de usuario es requerido',
            })}
          />
          {formErrors.username && (
            <p className="text-red-400 text-sm mt-1">
              {formErrors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
            {...register('email', {
              required: 'El email es requerido',
            })}
          />
          {formErrors.username && (
            <p className="text-red-400 text-sm mt-1">
              {formErrors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
            {...register('password', {
              required: 'La contraseña es requerida',
            })}
          />
          {formErrors.password && (
            <p className="text-red-400 text-sm mt-1">
              {formErrors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 rounded text-white font-semibold transition"
        >
          Registrarse
        </button>

        <p className="mt-6 text-center text-sm">
          Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="text-indigo-400 underline hover:text-indigo-500"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </main>
  );
};

export default withoutAuth(SignupPage);
