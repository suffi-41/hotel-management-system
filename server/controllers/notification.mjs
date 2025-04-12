import Notification from "../models/Notification.mjs";
import User from "../models/User.mjs";

export const getGuestNotifications = async (req, res) => {
    try {

        const id = req?._id;
        const guest = await User.findById(id);
        if (!guest || guest.isBlocked) {
            return res.status(404).json({ message: 'Guest not found or blocked' });
        }

        const notifications = await Notification.find({
            'recipient.userId': id,
            'recipient.userType': 'Guest',
            isDeleted: false,
        }).sort('-createdAt');
        return res.status(200).json({ status: true, notifications });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
}

export const getReciptionistNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({
            'recipient.userType': 'Reciptionist',
            isDeleted: false,
        }).sort('-createdAt');
        return res.status(200).json({ status: true, notifications });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
}


export const getManagerNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            'recipient.userType': 'Manager',
            isDeleted: false,
        }).sort('-createdAt');
        return res.status(200).json({ status: true, notifications });
    }
    catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
}
export const updateStatus = async (req, res) => {
    try {
        const id = req?._id;
        console.log(id)
        await Notification.updateMany(
            {
                'recipient.userId': id,
            },
            { $set: { status: 'read' } }
        );
        return res.json({ status: true });
    } catch (error) {
        return res.status(500).json({ status: false, message: "some error occuied!" });
    }
}


export const updateStatus_Ad_Reci = async (req, res) => {
    try {
        const userType = req?.params?.userType
        await Notification.updateMany(
            {
                'recipient.userType': userType,
            },
            { $set: { status: 'read' } }
        );
        return res.json({ status: true });
    } catch (error) {
        return res.status(500).json({ status: false, message: "some error occuied!" });
    }
}




