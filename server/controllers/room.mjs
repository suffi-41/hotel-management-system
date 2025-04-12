import multer from "multer"
import { uploadFileInCloudinary } from "../config/cloudUploaded.mjs"
import Room from "../models/Room.mjs"
import User from "../models/User.mjs"

export const addRoomDetials = async (req, res) => {
    try {
        const data = await req.body;
        if (!data) {
            return res.status(400).json({ status: false, message: "room detials are required" })
        }
        const files = await req.files;
        const images = [];


        if (!files) {
            return res.status(400).json({ status: false, message: "Room images are required" })
        }
        data.amenities = await JSON.parse(data.amenities)

        for (const file of files) {
            const result = await uploadFileInCloudinary(file.path)
            images.push(result);
        }
        data.images = images;
        const room = new Room(data);
        const result = await room.save();
        if (result) {
            return res.status(200).json({ status: true, message: "room detials added,suceessfully", id: result._id })
        }
        return res.status(200).json({ status: true, message: "room detials not added" })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })

    }
}

export const getRoomDetials = async (req, res) => {
    try {
        const rooms = await Room.find();
        if (rooms.length > 0) {
            return res.status(200).json({ status: true, rooms })
        }
        return res.status(200).json({ status: true, message: "Not found" })

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}


// update rooms detials
export const updateRoomDetials = async (req, res) => {
    try {
        const roomId = await req?.params?.id;
        const { type, price, capacity, description, status, amenities } = await req.body;
        console.log(amenities)
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,  // Room ID to search for
            {
                $set: {
                    type,
                    price,
                    status,
                    capacity,
                    description,
                    amenities,
                },
            },
            { new: true }  // Return the updated document after the operation
        );
        if (!updatedRoom) {
            return res.status(401).json({ status: true, message: "room not found" })
        }
        const result = updatedRoom.save();
        if (result) {
            return res.status(200).json({ status: true, message: "room detials updated" })
        }
        return res.status(200).json({ status: true, message: "room detials not updated" })

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

// add room images 
export const addRoomImages = async (req, res) => {
    try {
        const { roomId } = await req?.body;
        const files = await req.files;
        if (!files && files.length == 0) {
            return res.status(400).json({ status: false, message: "Room images are required" })
        }
        const rooms = await Room.findById(roomId, { images: 1 });
        if (!rooms) {
            return res.status(401).json({ status: true, message: "room not found" })
        }

        const { images } = rooms;

        for (const file of files) {
            const result = await uploadFileInCloudinary(file.path)
            images.push(result);
        }

        const result = await rooms.save();
        if (result) {
            return res.status(200).json({ status: true, message: "room images updated" })
        }
        return res.status(200).json({ status: true, message: "room images not updated, try again!" })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: "Some error occupied!" })
    }
}

export const getOneRoomDetials = async (req, res) => {
    try {
        const { id } = req?.params;
        const room = await Room.findById(id).populate({
            path: 'reviews.user',
            select: 'name avature' // Select specific fields from User model
        })
        if (!room) {
            return res.status(401).json({ status: true, message: "room not found" })
        }
        return res.status(200).json({ status: true, room })
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: "Some error occupied!" })
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const { id } = req?.params;
        const room = await Room.findByIdAndDelete(id);
        if (!room) {
            return res.status(200).json({ status: false, message: "Room not deleted, please try again!" })
        }
        return res.status(200).json({ status: true, message: "Room deleted" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied!" })
    }
}

export const addReviews = async (req, res) => {
    try {

        const userId = await req._id;
        const { id } = await req.params; // Get room ID from URL
        const { rating, comment } = await req?.body; // Get review details
        // Find the room
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ status: false, message: "Room not found" });
        }
        // Create new review
        const newReview = {
            user: userId,
            rating,
            comment,
            createdAt: new Date()
        };

        // Add the review to the room
        await room?.reviews?.push(newReview);
        // Recalculate average rating
        await room.calculateAverageRating();
        // Save updated room
        const result = await room.save();
        const user = await User.findById(userId, { name: 1, avature: 1 })
        if (user) {
            newReview.user = user;
        }
        if (!result) {
            return res.status(400).json({ status: false, message: "Review not added" });
        }
        const data = {
            newReview,
            avarageRatting: result.averageRating,
        }
        return res.status(400).json({ status: true, message: "Review added  successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }

}


export const roomTypeGroupforSum = async (req, res) => {
    try {
        const result = await Room.aggregate([
            {
                $group: {
                    _id: "$type",  // Group by room type
                    totalRooms: { $sum: 1 } // Count rooms per type
                }
            },
            {
                $project: {
                    _id: 0,          // Hide the default _id field
                    type: "$_id", // Rename _id to roomType
                    totalRooms: 1     // Include totalRooms
                }
            }
        ]);
        return res.status(201).json({
            status: true,
            data: result
        })

    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server errors!" })
    }
}


export const updateAmenity = async (req, res) => {
    try {
        const { id } = req.params;
        const { amenities } = req.body;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ status: false, message: "Room not found" });

        }
        room.amenities = amenities;
        const result = await room.save();
        if (!result) {
            return res.status(400).json({ status: false, message: "Amenity not updated" });
        }
        return res.status(200).json({ status: true, message: "Amenity updated successfully" });

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}


