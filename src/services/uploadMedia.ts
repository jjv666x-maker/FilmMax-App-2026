export const uploadMediaToServer = async ({
  file,
  type,
  target,
  userId
}: {
  file: File;
  type: "image" | "video";
  target: "profile" | "reel" | "story" | "cover";
  userId: string;
}) => {
  const reader = new FileReader();

  return new Promise<{ success: boolean; url?: string; message?: string }>((resolve) => {
    reader.onload = async () => {
      const dataUrl = String(reader.result);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            dataUrl,
            type,
            target,
            userId,
            fileType: file.type
          })
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          resolve({
            success: false,
            message: json.message || "فشل رفع الملف"
          });
          return;
        }

        resolve({
          success: true,
          url: json.url || json.publicUrl
        });
      } catch (error) {
        resolve({
          success: false,
          message: "فشل الاتصال بالخادم"
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: "قراءة الملف فشلت"
      });
    };

    reader.readAsDataURL(file);
  });
};
