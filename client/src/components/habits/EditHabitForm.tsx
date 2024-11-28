import { updateHabit } from '@/api';
import { HabitDetails } from '@/types';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingSpinner from '../LoadingSpinner';

interface EditHabitFormProps {
  habit: HabitDetails;
}

interface EditHabitFormValues {
  name: string;
  rules: string;
}
const EditHabitForm: FC<EditHabitFormProps> = ({ habit }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<EditHabitFormValues>();

  const router = useRouter();

  useEffect(() => {
    if (habit) {
      setValue('name', habit.name);
      setValue('rules', habit.rules);
    }
  }, [habit, setValue]);

  const onSubmit: SubmitHandler<EditHabitFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      await updateHabit(habit.id, data);
      alert('El Hábito ha sido actualizado correctamente');
      router.push(`/habits/${habit.id}`);
    } catch (error) {
      console.log('An error occurred during Habit update:', error);
      alert(
        'Ocurrió un problema al actualizar este hábito. Por favor intente de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-lg w-full"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Editar Hábito</h1>

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
          <p className="text-red-600 text-sm mt-1">{formErrors.name.message}</p>
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
        className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-300 rounded-lg text-white font-semibold flex justify-center items-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner /> : 'Guardar'}
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
  );
};

export default EditHabitForm;
