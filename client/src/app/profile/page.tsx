'use client';

import { FC, useRef, useState } from 'react';
import withAuth from '@/components/withAuth';
import { useFetchUserProfile } from '@/hooks/users';
import Image from 'next/image';
import { updateUserAvatar } from '@/api';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';

const ProfilePage: FC = () => {
  const { userProfile, loading, error, refresh } = useFetchUserProfile();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpdatePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        setIsUploading(true);
        await updateUserAvatar(formData);
        await refresh();
        alert('La foto de perfil ha sido actualizada correctamente');
      } catch (error) {
        console.error('Failed to upload picture:', error);
        alert('Ocurrió un error al actualizar la foto de perfil');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // TODO: show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Ocurrió un error al cargar los datos del perfil.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100">
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
      <button
        onClick={handleUpdatePicture}
        className={`text-blue-500 underline text-base mb-2 ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isUploading}
      >
        {isUploading ? 'Subiendo...' : 'Actualizar Avatar'}
      </button>

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
    </div>
  );
};

export default withAuth(ProfilePage);
