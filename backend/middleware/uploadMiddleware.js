const multer = require("multer");
const path = require("path");

// Store uploaded PDF files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check allowed file type (PDF only)
function checkFileType(file, cb) {
  // Check file extension
  const extname = path.extname(file.originalname).toLowerCase() === ".pdf";

  // Check MIME type
  const mimetype = file.mimetype === "application/pdf";

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("PDF files only! Only .pdf files are allowed."));
  }
}

// Upload settings
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;