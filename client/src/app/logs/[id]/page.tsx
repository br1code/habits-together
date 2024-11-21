import { FC } from 'react';

interface ViewHabitLogPageProps {
  params: {
    id: string;
  };
}

const ViewHabitLogPage: FC<ViewHabitLogPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <main>
      <h1>View Habit Log with Id {id}</h1>
    </main>
  );
};

export default ViewHabitLogPage;
