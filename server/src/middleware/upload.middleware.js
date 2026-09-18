import multer from "multer";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return callback(
      new Error("Only JPG, PNG, and WebP images are allowed"),
      false,
    );
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 1,
  },
  fileFilter,
});

export const uploadAvatar = upload.single("avatar");
