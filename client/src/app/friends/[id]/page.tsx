import { FC } from 'react';

interface ViewFriendPageProps {
  params: {
    id: string;
  };
}

const ViewFriendPage: FC<ViewFriendPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <main>
      <h1>View Friend with Id {id}</h1>
    </main>
  );
};

export default ViewFriendPage;
