'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuthContext } from '@/contexts/AuthContext';
import { login } from '@/api';
import withoutAuth from '@/components/withoutAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormValues>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const authContext = useAuthContext();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      const result = await login(data);
      authContext.login(result.accessToken);
      router.push('/');
    } catch (error) {
      console.log('An error occurred during login:', error);
      alert('Usuario o contraseña incorrectos. Por favor intente de nuevo.');
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
        <h1 className="text-4xl font-bold mb-6 text-center">Bienvenido</h1>

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
            })}
          />
          {formErrors.username && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.username.message}
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
              autoComplete="current-password"
              className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
              {...register('password', {
                required: 'La contraseña es requerida',
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
          {isSubmitting ? <LoadingSpinner /> : 'Iniciar Sesión'}
        </button>

        <p className="mt-6 text-center text-sm">
          No tienes una cuenta?{' '}
          <Link
            href="/signup"
            className="text-indigo-700 underline hover:text-indigo-800"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
};

export default withoutAuth(LoginPage);
