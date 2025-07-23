import express from 'express'
import multer from 'multer'
import cloudinary from '../utils/cloudinaryConfig.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const router = express.Router()
const upload = multer({ dest: 'uploads/' }) 

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = req.file.path

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'chat_media',
      public_id: uuidv4()
    })

    fs.unlinkSync(filePath)

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    })
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message })
  }
})

export default router
