import { FC } from 'react';

interface EditHabitPageProps {
  params: {
    id: string;
  };
}

const EditHabitPage: FC<EditHabitPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <main>
      <h1>Edit Habit with Id {id}</h1>
    </main>
  );
};

export default EditHabitPage;
