import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey=process.env.STREAM_API
const apiSecret=process.env.STREAM_SECRET

if(!apiKey||!apiSecret){
    console.log("stream Api Key or Secret is missing")
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Error upserting stream user:",error)
    }
}


export const generateStreamToken=(userId)=>{
    try {
        const userIdStr=userId.toString();
        return streamClient.createToken(userIdStr)
    } catch (error) {
         console.error("Error generating Stream Token ",error);
    }
}