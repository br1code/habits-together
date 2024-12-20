import { FC, useRef, useState } from 'react';
import Image from 'next/image';
import { updateUserAvatar } from '@/api';
import { UserProfile } from '@/types';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';
import { useAuthContext } from '@/contexts/AuthContext';

interface UserProfileCardProps {
  userProfile: UserProfile;
  refreshUserProfile?: () => Promise<void>;
}

const UserProfileCard: FC<UserProfileCardProps> = ({
  userProfile,
  refreshUserProfile,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthContext();
  const isCurrentUserProfile = user?.id === userProfile.id;

  const handleUpdatePicture = () => {
    if (!isCurrentUserProfile) {
      return;
    }

    alert(
      'Por favor intente utilizar una imágen con ratio 1:1 (cuadrado). Ejemplo: 500x500'
    );
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isCurrentUserProfile) {
      return;
    }

    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        setIsUploading(true);
        await updateUserAvatar(formData);

        if (refreshUserProfile) {
          await refreshUserProfile();
        }

        alert('La foto de perfil ha sido actualizada correctamente');
      } catch (error) {
        console.error('Failed to upload picture:', error);
        alert('Ocurrió un error al actualizar la foto de perfil');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center bg-white shadow rounded-lg mt-4 p-4">
      {/* Profile Picture */}
      <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden mb-4">
        <Image
          src={userProfile.profilePictureUrl || DEFAULT_AVATAR_PICTURE_URL}
          alt="Profile Picture"
          width={128}
          height={128}
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Update Picture Button */}
      {isCurrentUserProfile && (
        <button
          onClick={handleUpdatePicture}
          className={`text-blue-500 underline text-base mb-2 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isUploading}
        >
          {isUploading ? 'Subiendo...' : 'Actualizar Avatar'}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="text-2xl font-semibold text-gray-800 mb-2">
        {userProfile.username}
      </div>

      <div className="text-lg text-gray-800 mb-2">
        Nivel: {userProfile.level}
      </div>

      <div className="text-base text-gray-700">
        Puntos de Experiencia: {userProfile.currentExperiencePoints} /{' '}
        {userProfile.requiredExperiencePoints}
      </div>
    </section>
  );
};

export default UserProfileCard;
