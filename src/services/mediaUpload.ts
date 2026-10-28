export const mediaUpload = {
  toDataUrl: (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('upload read failed'));
      reader.readAsDataURL(file);
    }),

  toObjectUrl: (file: File): string => URL.createObjectURL(file),

  validate: (file: File, type: 'image' | 'video') => {
    if (!file) return false;
    const allowedVideo = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedImage = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const allowed = type === 'video' ? allowedVideo : allowedImage;
    return allowed.includes(file.type);
  }
};
