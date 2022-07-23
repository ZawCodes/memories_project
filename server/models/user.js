import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    profile: {
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
    },
    password: {type: String, required: true},
})

export default mongoose.model("User", userSchema);