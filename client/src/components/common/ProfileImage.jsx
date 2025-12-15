import { useState, useEffect } from 'react';
import { getProfileImageUrl } from '../../utils/imageUtils';

/**
 * Composant pour afficher une image de profil avec gestion automatique des URLs présignées
 */
export default function ProfileImage({ 
  userId, 
  user, 
  size = 'md', 
  className = '', 
  fallbackInitials = null 
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Tailles prédéfinies
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl'
  };

  const sizeClass = sizes[size] || sizes.md;

  // Récupérer l'URL de l'image
  useEffect(() => {
    const loadImage = async () => {
      if (!userId || !user?.profileImage) {
        setImageUrl(null);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const url = await getProfileImageUrl(userId);
        setImageUrl(url);
      } catch (err) {
        console.warn('Erreur chargement image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [userId, user?.profileImage]);

  // Générer les initiales de fallback
  const getInitials = () => {
    if (fallbackInitials) return fallbackInitials;
    if (user?.firstname && user?.lastname) {
      return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  // Gestion d'erreur de chargement d'image
  const handleImageError = () => {
    setError(true);
    setImageUrl(null);
  };

  if (loading) {
    return (
      <div className={`${sizeClass} ${className} bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center animate-pulse`}>
        <div className="w-1/2 h-1/2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    );
  }

  if (imageUrl && !error) {
    return (
      <img
        src={imageUrl}
        alt={`${user?.firstname || 'User'} profile`}
        className={`${sizeClass} ${className} rounded-full object-cover shadow-sm`}
        onError={handleImageError}
      />
    );
  }

  // Fallback avec initiales
  return (
    <div className={`${sizeClass} ${className} bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}>
      {getInitials()}
    </div>
  );
}