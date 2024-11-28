import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createHabit } from '@/api';

interface NewHabitFormValues {
  name: string;
  rules: string;
}

const NewHabitForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<NewHabitFormValues>();

  const router = useRouter();

  const onSubmit: SubmitHandler<NewHabitFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      await createHabit(data);
      alert('El Hábito ha sido creado correctamente');
      router.push(`/habits`);
    } catch (error) {
      console.log('An error occurred during Habit creation:', error);
      alert(
        'Ocurrió un problema al crear este hábito. Por favor intente de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Crear Hábito</h1>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            autoComplete="off"
            type="text"
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
            {...register('name', {
              required: 'El nombre es requerido',
            })}
          />
          {formErrors.name && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.name.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="rules" className="block mb-2 text-sm font-medium">
            Reglas
          </label>

          <textarea
            id="rules"
            {...register('rules', { required: 'Las reglas son requeridas' })}
            rows={4}
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700 resize-none"
          />

          {formErrors.rules && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.rules.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-white font-semibold transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando ...' : 'Guardar'}
        </button>

        <p className="mt-6 text-sm text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-indigo-700 underline hover:text-indigo-800"
          >
            Volver
          </button>
        </p>
      </form>
    </section>
  );
};

export default NewHabitForm;
