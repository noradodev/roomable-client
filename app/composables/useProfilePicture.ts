export const useProfileImage = () => {
  const defaultAvatar =
    "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=anonymous";

  const getProfileUrl = (imagePath?: string | File | null) => {
    const mediaUrl = useRuntimeConfig().public.mediaUrl;
    return imagePath
      ? `${mediaUrl}/${imagePath}`
      : defaultAvatar;
  };

  return { getProfileUrl, defaultAvatar };
};