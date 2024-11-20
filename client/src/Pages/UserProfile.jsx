import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { IconButton, Stack, Avatar, Typography } from '@mui/material';
import { Edit as EditIcon, Done as DoneIcon, CameraAlt as CameraAltIcon } from '@mui/icons-material';
import MuiInput from '../utility/CustomeInput';
import { createFollow, getUserData, updateUserProfile } from '../AppWrite/Apibase';

export default function UserProfile() {
  const [userData, setUser] = useState(null);
  const { userId } = useParams();
  const authToken = localStorage.getItem('authToken');
  const [isLoading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const appUser = useSelector((state) => state.Auth.userData);

  const inputFields = [
    { label: 'Username', name: 'username', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Bio', name: 'bio', type: 'text' }
  ];

  const getUser = async () => {
    if(!isLoading) setLoading(true);
    if (!appUser) return;
    try {
      const data = await getUserData(userId, authToken)
      setUser(data.data); 
      setBio(data.data?.bio || '');
      setUsername(data.data?.username || '');
      setEmail(data.data?.email || '');
      setIsFollowing(data.data?.followers?.some((follow) => follow.follower._id === appUser?._id) || false);
      setIsAuthor(data.data?._id === appUser?._id);
      if(data.data?._id === appUser?._id){
        await dispatch(Login({ user: response.data.data, token: authToken }));
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      const response = await createFollow(userId, authToken);
      setIsFollowing((prev) => !prev);
      toast.success(response.message, {
        autoClose: 1000,
        style: {
          backgroundColor: "#2e1065",
          color: "#ffffff",
        },
        hideProgressBar: true,
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleEdit = () => {
    if (isEdit) {
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('username', username);
      formData.append('email', email);
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      setLoading(true); 

      updateUserProfile(formData, authToken)
        .then((response) => {
          setUser(response.data);
          toast.success('Profile updated successfully!');
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error updating profile:", error);
          setLoading(false);
          toast.error('Error updating profile!');
        });
    }
    setIsEdit(!isEdit);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    if(!isLoading) setLoading(true);
    if (appUser) {
      getUser();
    }
  }, [userId, appUser, isFollowing, isClicked]);

  if (isLoading) {
    return (
        <div className="w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-[#14061F] to-black py-12">
            <div className="p-4 w-full flex flex-col justify-center items-center">
                <h1 className="text-4xl font-semibold text-white">
                    "Patience, the Best Stories Are Worth the Wait."
                </h1>
                <p className="text-lg mt-2 text-gray-300">
                    We’re brewing something great! Check back soon for fresh content.
                </p>
            </div>
            <div className='mt-[5rem]'>
                <ScaleLoader color="#ffffff" height={50} />
            </div>
        </div>
    );
}

  if (!isLoading) return (
    <div className="bg-gradient-to-b from-black via-purple-950 to-black min-h-screen flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-[40rem] bg-gradient-to-b from-purple-800 to-indigo-900 rounded-xl shadow-lg p-8 text-white text-center">
        <Stack direct ion="column" alignItems="center">
          <div className="relative">
            <Avatar
              src={selectedImage ? URL.createObjectURL(selectedImage) : userData?.profileImage}
              sx={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                border: '3px solid #fff',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            />
            {isEdit && (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  ':hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  },
                }}
                component="label"
              >
                <CameraAltIcon />
                <input type="file" hidden onChange={handleFileChange} />
              </IconButton>
            )}
          </div>
          <div className="mt-6 space-y-4">
            {inputFields.map(({ label, name, type }) => (
              isEdit ? (
                <MuiInput
                  key={name}
                  label={label}
                  type={type}
                  value={name === 'username' ? username : name === 'email' ? email : bio}
                  onChange={(e) => {
                    if (name === 'username') setUsername(e.target.value);
                    if (name === 'email') setEmail(e.target.value);
                    if (name === 'bio') setBio(e.target.value);
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography key={name} className="text-lg text-gray-300">{name === 'username' ? username : name === 'email' ? email : bio}</Typography>
              )
            ))}
            <Typography className="text-gray-400">Joined: {new Date(userData?.createdAt).toLocaleDateString()}</Typography>
            {isEdit ? (
              <IconButton onClick={handleEdit} sx={{ mt: 2, color: 'white' }}>
                <DoneIcon />
              </IconButton>
            ) : (
              isAuthor ? 
              <IconButton onClick={() => setIsEdit(true)} sx={{ mt: 2, color: 'white' }}>
                <EditIcon />
              </IconButton> : null
            )}
          </div>
        </Stack>

        <div className="flex justify-around mt-6 text-gray-300">
          <div>
            <p className="text-xl font-bold">{userData?.followers?.length || 0}</p>
            <p className="text-sm">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold">{userData?.totalPosts || 0}</p>
            <p className="text-sm">Posts</p>
          </div>
        </div>

        {!isAuthor && (
          <button
            onClick={handleFollow}
            className="mt-8 px-6 py-2 rounded-full shadow-md transform transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white"
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
}