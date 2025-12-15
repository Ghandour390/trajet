import * as usersAPI from '../api/users';

// Cache pour les URLs d'images avec expiration
const imageUrlCache = new Map();
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

/**
 * Récupère l'URL présignée d'une image de profil utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<string|null>} URL présignée ou null si pas d'image
 */
export const getProfileImageUrl = async (userId) => {
  if (!userId) return null;

  const cacheKey = `profile_${userId}`;
  const cached = imageUrlCache.get(cacheKey);

  // Vérifier si l'URL est en cache et encore valide
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.url;
  }

  try {
    const response = await usersAPI.getProfileImageUrl(userId);
    const url = response.profileImage;
    
    // Mettre en cache avec timestamp
    imageUrlCache.set(cacheKey, {
      url,
      timestamp: Date.now()
    });
    
    return url;
  } catch (error) {
    console.warn('Erreur récupération image profil:', error);
    return null;
  }
};

/**
 * Invalide le cache d'une image de profil
 * @param {string} userId - ID de l'utilisateur
 */
export const invalidateProfileImageCache = (userId) => {
  const cacheKey = `profile_${userId}`;
  imageUrlCache.delete(cacheKey);
};

/**
 * Nettoie le cache des URLs expirées
 */
export const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of imageUrlCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      imageUrlCache.delete(key);
    }
  }
};

// Nettoyage automatique du cache toutes les 10 minutes
setInterval(cleanExpiredCache, 10 * 60 * 1000);