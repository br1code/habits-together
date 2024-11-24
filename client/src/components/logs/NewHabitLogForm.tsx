import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createHabitLog } from '@/api';
import { useFetchHabits } from '@/hooks/habits';

interface NewHabitLogFormValues {
  habitId: string;
  text?: string;
  photo: FileList;
}

const NewHabitLogForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<NewHabitLogFormValues>({
    defaultValues: {
      habitId: '',
    },
  });

  const router = useRouter();

  const {
    habits = [],
    loading: habitsLoading,
    error: habitsError,
  } = useFetchHabits();

  const onSubmit: SubmitHandler<NewHabitLogFormValues> = async (data) => {
    try {
      const formData = new FormData();

      const photoFile = data.photo[0];

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      formData.append('habitId', data.habitId);
      formData.append('text', data.text || '');

      setIsSubmitting(true);
      const result = await createHabitLog(formData);
      alert('El Hábito ha sido logueado correctamente');
      router.push(`/logs/${result}`);
    } catch (error) {
      console.log('An error occurred during Habit Log creation:', error);
      alert(
        'Ocurrió un problema al loguear este hábito. Por favor intente de nuevo.'
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
        <h1 className="text-4xl font-bold mb-6 text-center">Loguear Hábito</h1>

        <div className="mb-4">
          <label htmlFor="habitId" className="block mb-2 text-sm font-medium">
            Hábito
          </label>
          <select
            id="habitId"
            {...register('habitId', { required: 'El hábito es requerido' })}
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
          >
            {habitsLoading ? (
              <option value="" disabled>
                Cargando Hábitos ...
              </option>
            ) : habitsError ? (
              <option value="" disabled>
                Error al cargar Hábitos
              </option>
            ) : (
              <>
                <option value="" disabled>
                  Seleccionar Hábito
                </option>
                {habits?.map((habit) => (
                  <option
                    key={habit.id}
                    value={habit.id}
                    disabled={habit.wasLoggedToday}
                  >
                    {habit.wasLoggedToday
                      ? `${habit.name} (Logueado)`
                      : habit.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {formErrors.habitId && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.habitId.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="photo" className="block mb-2 text-sm font-medium">
            Foto
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            {...register('photo', { required: 'La foto es requerida' })}
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700"
          />
          {formErrors.photo && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.photo.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="text" className="block mb-2 text-sm font-medium">
            Texto
          </label>

          <textarea
            id="text"
            {...register('text')}
            rows={4}
            className="w-full p-2 bg-gray-50 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-indigo-700 resize-none"
          />

          {formErrors.text && (
            <p className="text-red-600 text-sm mt-1">
              {formErrors.text.message}
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
      </form>
    </section>
  );
};

export default NewHabitLogForm;
