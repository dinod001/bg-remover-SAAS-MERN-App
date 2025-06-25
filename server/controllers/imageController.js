import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from '../models/userModel.js'



//Controller function to remove bg from image
const removeBgImage = async (req, res) => {
    try {

        const { clerkId } = req.clerkId

        console.log(clerkId);
        

        const user = await userModel.findById({ clerkId })

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const imagePath = req.file.path;

        //reading the image files
        const imageFile = fs.createReadStream(imagePath)

        const formData = new FormData();
        formData.append('image_file', imageFile)

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({ success: true, resultImage, creditBalance: user.creditBalance - 1, message: 'Background Removed' })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export { removeBgImage }