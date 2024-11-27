import { UserProfile } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';

interface FriendsListProps {
  friendProfiles: UserProfile[];
}

const FriendsList: FC<FriendsListProps> = ({ friendProfiles }) => {
  return (
    <section className="w-full bg-white rounded-lg shadow-lg p-4">
      <table className="w-full text-left border-collapse">
        <tbody>
          {friendProfiles.map((friend) => (
            <tr
              key={friend.id}
              className="border-b last:border-none hover:bg-gray-100"
            >
              <td className="py-2 px-4 flex items-center space-x-3">
                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={friend.profilePictureUrl || DEFAULT_AVATAR_PICTURE_URL}
                    alt={`${friend.username}'s avatar`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <span className="font-bold text-lg">{friend.username}</span>
              </td>
              <td className="py-2 px-4 text-right">
                <Link href={`/friends/${friend.id}`}>
                  <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                    <HiArrowRight
                      className="text-gray-600 hover:text-gray-700"
                      size={18}
                    />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default FriendsList;
