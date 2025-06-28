import React from 'react'
import { Link } from 'react-router';
import { capitialize } from '../constants/capitilize';
 
const FriendCard = ({friend}) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
        <div className='card-body p-4'>
            <div className='flex items-center gap-3 mb-3'>
                <div className='avatar size-14 rounded-full overflow-hidden'>
                    <img src={friend.profilePic} alt={friend.fullName}/>
                </div>
                <h3 className='font-semibold truncate'>{friend.fullName}</h3>
            </div>
            <div className='flex flex-wrap gap-1.5 mb-3'>
              <span className='badge badge-secondary text-xs'>
                Native:{" "}{capitialize(friend.nativeLanguage)}
              </span>
            </div>
            <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full btn-primary">
            Message
            </Link>
        </div>
    </div>
  )
}

export default FriendCard;