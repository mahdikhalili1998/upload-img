import multer from "multer";
import path from "path";
import { NextResponse } from "next/server";

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "public", "uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        reject(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      // Ensure req.file is defined
      if (!req.file) {
        reject(
          NextResponse.json({ error: "File upload failed" }, { status: 400 })
        );
        return;
      }

      const filePath = `/uploads/${req.file.filename}`;
      resolve(
        NextResponse.json({
          message: "File uploaded successfully",
          path: filePath,
        })
      );
    });
  });
}
