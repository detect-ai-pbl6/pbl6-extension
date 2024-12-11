"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { refreshAccessToken } from "@/app/api/refresh_token/route";

const UserProfile = () => {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        avatar: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUserProfile = async () => {
            const accessToken = localStorage.getItem("access");
            const expirationTime = localStorage.getItem("expiration");

            if (accessToken) {
                if (expirationTime && Date.now() < parseInt(expirationTime)) {
                    try {
                        const response = await fetch(`${apiUrl}/users/me`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${accessToken}`,
                            },
                        });

                        if (!response.ok) {
                            throw new Error("Failed to fetch user data");
                        }

                        const data = await response.json();
                        setUser(data);
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to fetch user data");
                    }
                } else {
                    await refreshAccessToken();
                }
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const avatarBase64 = reader.result;
                const accessToken = localStorage.getItem("access");

                if (accessToken) {
                    try {
                        const response = await fetch(`${apiUrl}/users/me`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({ avatar: avatarBase64 })
                        });
                        if (response.ok) {
                            const updatedUser = await response.json();
                            setUser(updatedUser);
                        } else {
                            console.error("Failed to update avatar");
                        }
                    } catch (error) {
                        console.error("Error updating avatar:", error);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("access");

        if (accessToken) {
            try {
                const response = await fetch(`${apiUrl}/users/me`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(user)
                });
                if (response.ok) {
                    const updatedUser = await response.json();
                    setUser(updatedUser);
                    setIsEditing(false);
                } else {
                    console.error("Failed to update user profile");
                }
            } catch (error) {
                console.error("Error updating user profile:", error);
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex pt-20 pb-20 flex-1 flex-row justify-center sm:px-8 lg:px-10">
            <div className="w-1/2 pb-20 pr-10 flex flex-col items-center">
                <img src={user.avatar} alt="Avatar" className="w-80 h-80 rounded-full mb-4" />
            </div>

            <div className="w-1/2 pl-4">
                <h1 className="text-3xl mb-4">User Profile</h1>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={user.first_name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={user.last_name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Upload Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                            />
                        </div>

                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="mt-4 bg-indigo-600 text-white font-semibold py-1 px-2 rounded-md shadow hover:bg-indigo-500 text-base"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="mt-4 bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-md shadow hover:bg-gray-400 text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="flex flex-col space-y-3">
                            <p className="text-lg"><strong>First Name:</strong> <span className="text-gray-600">{user.first_name}</span></p>
                            <p className="text-lg"><strong>Last Name:</strong> <span className="text-gray-600">{user.last_name}</span></p>
                            <p className="text-lg"><strong>Email:</strong> <span className="text-gray-600">{user.email}</span></p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 bg-indigo-600 text-white font-semibold py-1 px-2 rounded-md shadow hover:bg-indigo-500 text-base"
                        >
                            Update Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
