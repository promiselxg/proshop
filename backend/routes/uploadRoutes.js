import express from 'express'
import multer from 'multer'
import path from 'path'
const router = express.Router()

//  file upload storage setting
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

//  check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images Only!')
  }
}
//  file upload
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})
export default router
