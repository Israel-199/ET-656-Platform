import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getFriendRequests, getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import FriendCard from '../components/FriendCard';
import NotFriendsFound from '../components/NotFriendsFound';
import {MapPinIcon,CheckCircleIcon, UsersIcon, UserPlusIcon} from "lucide-react";
import { Link } from 'react-router';

const HomePage = () => {
  const queryClient=useQueryClient();
  const [outgoingRequestsIds,setOutgoingRequestsIds]=useState(new Set());

   const { data: friendRequests } = useQuery({
      queryKey: ["friendRequests"],
      queryFn: getFriendRequests,
    });
  
   const incomingRequests = friendRequests?.incomingReqs || [];

  const{data:friends=[],isLoading:loadingFriends}=useQuery({
    queryKey:["friends"],
    queryFn:getUserFriends,
  });

   const{data:recommendedUsers=[],isLoading:loadingUsers}=useQuery({
    queryKey:["users"],
    queryFn:getRecommendedUsers,
  });
   
    const{data:outgoingFriendReqs=[]}=useQuery({
    queryKey:["outgoingFriendReqs"],
    queryFn:getOutgoingFriendReqs,
  });

  const{mutate:sendRequestMutation,isPending}=useMutation({
    mutationFn:sendFriendRequest,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]}),
  });

   useEffect(()=>{
    const outgoingIds=new Set()
    if(outgoingFriendReqs&&outgoingFriendReqs.length>0){
      outgoingFriendReqs.forEach((req)=>{
        outgoingIds.add(req.recipient._id);
      })
      setOutgoingRequestsIds(outgoingIds);
    }
   },[outgoingFriendReqs]);

 const capitialize=(str)=>str.charAt(0).toUpperCase()+str.slice(1);
  return (
    <div className='p-4 sm:p-6 lg:p-8 h-screen'>
  <div className='container mx-auto space-y-10'>
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
      <Link to="/notifications" className="btn btn-outline btn-sm btn-primary">
        <UsersIcon className="mr-2 size-4" />
        Friend Requests{" "}
     {incomingRequests.length?(
      <span className="badge badge-primary ml-2">
         {incomingRequests.length} 
        </span>
        ):(
          <div></div>
        )
      }
      </Link>
    </div>

    {loadingFriends ? (
      <div className='flex justify-center py-12'>
        <span className='loading loading-spinner loading-lg' />
      </div>
    ) : friends.length === 0 ? (
      <NotFriendsFound />
    ) : (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {friends.map((friend) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
      </div>
    )}

    <section>
      <div className='mb-6 sm:mb-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Friends</h2>
            <p className='opacity-70'>
              Discover new friends and enhance your communication skills.
            </p>
          </div>
        </div>
      </div>

      {loadingUsers ? (
        <div className='flex justify-center py-12'>
          <span className='loading loading-spinner loading-lg'></span>
        </div>
      ) : recommendedUsers.length === 0 ? (
        <div className='card bg-base-200 p-6 text-center'>
          <h3 className='font-semibold text-lg mb-2'>No recommendations available</h3>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {recommendedUsers.map((user) => {
            const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
            return (
              <div
                key={user._id}
                className='card bg-base-200 hover:shadow-lg transition-all duration-300'
              >
                <div className='card-body p-5 space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='avatar size-16 rounded-full overflow-hidden'>
                      <img src={user.profilePic} alt={user.fullName} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg'>{user.fullName}</h3>
                      {user.location && (
                        <div className='flex items-center text-xs opacity-70 mt-1'>
                          <MapPinIcon className='size-3 mr-1' />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {user.nativeLanguage}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                  </div>

                    {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                    <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
  </div>
</div>
  )
};

export default HomePage;