import multer from "multer";

// Configure multer for file uploads
// Files will be stored in the 'public/temp' directory with their original names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage,
}
)