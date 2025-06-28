
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFriendRequests, logout } from '../lib/api';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';


const Navbar = () => {
    const {authUser}=useAuthUser();
    const location=useLocation();
    const isChatPage=location.pathname?.startsWith("/chat");

    const queryClient=useQueryClient();

  const {mutate:logoutMutation} = useMutation({
        mutationFn:logout,
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
    })

     const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
      });

     const incomingRequests = friendRequests?.incomingReqs || [];
    
  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-end w-full'>
               {
                isChatPage && (
                    <div className='pl-5'>
                    <Link to="/" className='flex items-center gap-2.5'>
                    <ShipWheelIcon className='size-9 text-primary'/>
                     <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300 tracking-wider'>
            ET-656
          </span>
                    </Link>
                    </div>
                )
               }
               <div className='flex items-center gap-8 sm:gap-4 ml-auto mr-2'>
                <Link to={"/notifications"}>
                 <button className='btn btn-ghost btn-circle relative'>
  <BellIcon className='h-6 w-6 text-base-content opacity-70' />
  {incomingRequests.length > 0 && (
    <span className="badge badge-primary absolute -top-1 -right-1 text-xs">
      {incomingRequests.length}
    </span>
  )}
</button>
               </Link>
               </div>
               <div className='avatar'>
                 <div className='w-9 rounded-full mr-2'>
                  <Link to="/onboarding"><img src={authUser?.profilePic} alt="User profile pic" rel="noreferrer"/>
           </Link>      </div>
               </div>
               <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
                <LogOutIcon className='h-6 w-6 text-base-content opacity-70'/>
               </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar;