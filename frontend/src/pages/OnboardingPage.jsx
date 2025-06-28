import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import toast from "react-hot-toast";
import { LANGUAGES } from "../constants/lang";
import { LoaderIcon, MapPinIcon, ShipWheelIcon } from "lucide-react";
import { CameraIcon } from "@heroicons/react/24/solid"; 
import { useRef } from "react";
import { useNavigate } from "react-router";
import BackButton from "../components/BackButton";



const OnboardingPage = () => {
  const navigate=useNavigate();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn:  completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Complete Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    setFormState({ ...formState, profilePic: reader.result });
    toast.success("Profile Image Uploaded!");
  };
  reader.readAsDataURL(file);
};

const fileInputRef = useRef();

  return (
    <div>
   <section className="ml-100"></section>
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
         <BackButton/>
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex flex-col items-center justify-center space-y-4">

  <div className="relative size-32 rounded-full bg-base-300 overflow-hidden">
    {formState.profilePic ? (
      <img
        src={formState.profilePic}
        alt="Profile Preview"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <CameraIcon className="size-12 text-base-content opacity-40" />
      </div>
    )}

    <button
      type="button"
      onClick={() => fileInputRef.current.click()}
      className="absolute bottom-2 right-4 bg-base-100 rounded-full p-1 shadow-md"
    >
      <CameraIcon className="size-5 text-base-content" />
    </button>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleImageUpload}
      className="hidden"
    />
  </div>
</div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                    Complete Profile
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Completing...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};
export default OnboardingPage;





