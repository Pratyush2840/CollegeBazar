import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer, filename) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'collegebazaar', public_id: filename },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);

  });
  
};
