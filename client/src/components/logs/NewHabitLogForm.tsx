import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createHabitLog } from '@/api';
import { useFetchHabits } from '@/hooks/habits';
import LoadingSpinner from '../LoadingSpinner';

interface NewHabitLogFormValues {
  habitId: string;
  text?: string;
  photo: File;
}

const NewHabitLogForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    register('photo', { required: 'La foto es requerida' });
  }, [register]);

  const onSubmit: SubmitHandler<NewHabitLogFormValues> = async (data) => {
    try {
      const formData = new FormData();

      formData.append('habitId', data.habitId);
      formData.append('text', data.text || '');
      formData.append('photo', data.photo);

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-lg w-full"
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
        <label className="block mb-2 text-sm font-medium">Foto</label>
        <div className="flex gap-2">
          {/* Camera Button */}
          <input
            id="camera"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                setValue('photo', file, { shouldValidate: true });
              }
            }}
          />
          <label
            htmlFor="camera"
            className="py-2 px-4 bg-stone-700 hover:bg-stone-800 text-white rounded-lg cursor-pointer text-center font-semibold flex-1"
          >
            Tomar Foto
          </label>

          {/* Gallery Button */}
          <input
            id="gallery"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                setValue('photo', file, { shouldValidate: true });
              }
            }}
          />
          <label
            htmlFor="gallery"
            className="py-2 px-4 bg-stone-700 hover:bg-stone-800 text-white rounded-lg cursor-pointer text-center font-semibold flex-1"
          >
            Seleccionar Foto
          </label>
        </div>

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
          <p className="text-red-600 text-sm mt-1">{formErrors.text.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-300 rounded-lg text-white font-semibold flex justify-center items-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner /> : 'Guardar'}
      </button>
    </form>
  );
};

export default NewHabitLogForm;
