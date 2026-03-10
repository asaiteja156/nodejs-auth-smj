import Image from "../models/Image.js"
import {uploadToCloudinary} from "../helpers/cloudinaryHelper.js"
import fs from "fs"
import cloudinary from "../config/cloudinary.js"

const uploadImageController = async (req,res) => {
    try {

       // Check if file is missing in req-object
       if(!req.file){
            return res.status(400).json({
                success : false,
                message : 'File is required. Please upload an image'
            })
       } 

       // Upload to cloudinary
       const {url,publicId} = await uploadToCloudinary(req.file.path)

       // store the image url and public id along with the uploaded userId in database
       const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId
       })
       await newlyUploadedImage.save();

       // delete the file from local storage
       fs.unlinkSync(req.file.path);

       res.status(201).json({
        success : true,
        message : 'Image uploaded successfully',
        image : newlyUploadedImage
       })

    } catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again'
        })
    }

}

const fetchImagesController = async (req,res) => {
    try {
        // Pagination implementation
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 5; 
        const skip  = (page-1)*limit;
        
        // Sorting Implementation
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1 ;

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);
 
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages,
                data : images
            })
        }
    } catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again'
        })
    }
}

const deleteImageController = async (req,res) => {
    try {
       const getCurrentImageIdToBeDeleted = req.params.id;
       const userId = req.userInfo.userId;

       const image = await Image.findById(getCurrentImageIdToBeDeleted);
       if(!image){
            return res.status(404).json({
                success : false,
                message : 'Image not found'
            })
       }

       // Check if image is uploaded by current user who is trying ti delete this image
       if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : 'You are not authorized to delete this image'
            })
       }

       // delete this image from cloudinary storage
       await cloudinary.uploader.destroy(image.publicId);

       // delete this image from database
       await Image.findByIdAndDelete(getCurrentImageIdToBeDeleted);

       res.status(200).json({
        success : true,
        message : 'Image deleted successfully'
       })
       
    } catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again'
        })
    }
}

export  {uploadImageController,fetchImagesController, deleteImageController};