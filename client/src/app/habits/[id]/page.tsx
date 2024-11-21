import { FC } from 'react';

interface ViewHabitPageProps {
  params: {
    id: string;
  };
}

const ViewHabitPage: FC<ViewHabitPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <main>
      <h1>View Habit with Id {id}</h1>
    </main>
  );
};

export default ViewHabitPage;
