'use client';

import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import withoutAuth from '@/components/withoutAuth';
import { signup } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      await signup(data);
      alert('Tu cuenta ha sido creada. Ya puedes iniciar sesión');
      router.push('/login');
    } catch (error) {
      console.log('An error occured during signup', error);
      alert('Error al registrarse. Por favor intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-screen-sm mx-auto flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Nuevo Usuario</h1>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
            {...register('username', {
              required: 'El nombre de usuario es requerido',
              validate: (value) => {
                return (
                  !/\s/.test(value) ||
                  'El nombre de usuario no debe contener espacios'
                );
              },
            })}
          />
          {formErrors.username && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
            {...register('email', {
              required: 'El email es requerido',
            })}
          />
          {formErrors.email && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
              {...register('password', {
                required: 'La contraseña es requerida.',
                minLength: 6,
              })}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-300 rounded-lg text-white font-semibold flex justify-center items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner /> : 'Registrarse'}
        </button>

        <p className="mt-6 text-center text-sm">
          Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="text-indigo-700 underline hover:text-indigo-800"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </main>
  );
};

export default withoutAuth(SignupPage);
