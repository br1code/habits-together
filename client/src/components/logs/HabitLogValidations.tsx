import { FC } from 'react';
import Image from 'next/image';
import { HabitLogValidation } from '@/types';
import { formatTimeAgo } from '@/utils/dateUtils';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { getProfileLink } from '@/utils/utils';

interface HabitLogValidationsProps {
  validations: HabitLogValidation[];
}

const HabitLogValidations: FC<HabitLogValidationsProps> = ({ validations }) => {
  const { user: authenticatedUser } = useAuthContext();

  return (
    <section>
      <div className="px-4 py-2 border-b">
        <p className="text-base font-semibold mb-2">Validaciones</p>

        {validations.length > 0 ? (
          <div className="space-y-4">
            {validations.map((validation) => (
              <div
                key={validation.userId}
                className="flex items-start space-x-4"
              >
                {/* Avatar */}
                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                  <Link
                    href={getProfileLink(
                      validation.userId,
                      authenticatedUser!.id
                    )}
                  >
                    <Image
                      src={
                        validation.userProfilePictureUrl ||
                        DEFAULT_AVATAR_PICTURE_URL
                      }
                      alt={`${validation.username}'s avatar`}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </Link>
                </div>

                {/* Validation Content */}
                <div>
                  <Link
                    href={getProfileLink(
                      validation.userId,
                      authenticatedUser!.id
                    )}
                  >
                    <p className="text-sm">
                      <span className="font-semibold mr-2">
                        {/* TODO: use react-icons */}
                        {validation.username} ✅
                      </span>
                    </p>
                  </Link>

                  <p className="text-xs text-gray-400">
                    Validado {formatTimeAgo(validation.validatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Este log aún no ha sido validado ❌
          </p>
        )}
      </div>
    </section>
  );
};

export default HabitLogValidations;
