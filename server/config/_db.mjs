import mongoose from "mongoose";

const CONNECT_DB = async () => {
    try {

        await mongoose.connect(process.env.MONGOOSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true

        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

export default CONNECT_DB; 