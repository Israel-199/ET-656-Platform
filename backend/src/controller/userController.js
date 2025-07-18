import friendRequest from "../models/friendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, 
        { _id: { $nin: currentUser.friends } }, 
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function sendFriendRequest(req,res){
try {
   const myId=req.user.id;
   const {id:recipientId} =req.params; 

   if(myId===recipientId){
    return res.status(400).json({message:"You can't send friend request to yourself"});
   }

   const recipient=await User.findById(recipientId);
   if(!recipient){
    return res.status(404).json({message:"Recipient not found"})
   }

   if(recipient.friends.includes(myId)){
     return res.status(400).json({message:"You are already friends with this user"});
   }

   const existingRequest=await friendRequest.findOne({
    $or:[
      {sender:myId,recipient:recipientId},
      {sender:recipientId,recipient:myId},
    ]
   })
   if(existingRequest){
    return res.status(400).json({message:"A friend request already exists between you and this user"});
   }

   const FriendRequest=await friendRequest.create({
    sender:myId,
    recipient:recipientId,
   })

   res.status(201).json(FriendRequest)

} catch (error) {
    console.error("Error in sendFriendRequest controller",error.message);
    res.status(500).json({message:"Internal Server Error"})
}
}

export async function acceptFriendRequest(req,res){
    try {
      const {id:requestId}=req.params;  

      const FriendRequest=await friendRequest.findById(requestId)

      if(!FriendRequest){
        return res.status(404).json({message:"Friend request not found"})
      }

       if(FriendRequest.recipient.toString() !== req.user.id){
        return res.status(404).json({message:"You are not authorized to accept this request"});
      }

       FriendRequest.status="accepted";
       await FriendRequest.save();

       await User.findByIdAndUpdate(FriendRequest.recipient,{
        $addToSet:{friends:FriendRequest.sender},
       })

        res.status(200).json({message:"Friend request accepted"});
    } catch (error) {
    console.error("Error in acceptFriendRequest controller",error.message);
    res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await friendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await friendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await friendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
