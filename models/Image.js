import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    
    url : {
        type : String,
        required : true
    },

    publicId : {
        type : String,
        required : true
    },

    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }

},{
    timestamps : true
})

const ImageModel = mongoose.model('Image', ImageSchema);

export default ImageModel;