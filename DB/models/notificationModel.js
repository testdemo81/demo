import mongoose from "mongoose"


const notificationSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: [true, 'MSG required'],
    },
    type: {
        type: String,
        required: [true, 'Type required'],
        enum: ['stock','tailor'],
    },
}, {
    timestamps: true
})

const notificationModel = mongoose.models.Notification || mongoose.model(" Notification",notificationSchema)

export default notificationModel