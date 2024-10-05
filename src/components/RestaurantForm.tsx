import React, { useState } from "react";
import { Restaurant } from "../types/Restaurant";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import {
  addRestaurant,
  updateRestaurant,
  uploadImage,
} from "../services/RestaurantService";

interface Props {
  restaurant?: Restaurant;
  onSubmit: () => void;
}

const RestaurantForm: React.FC<Props> = ({ restaurant, onSubmit }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [name, setName] = useState(restaurant?.name || "");
  const [address, setAddress] = useState(restaurant?.address || "");
  const [description, setDescription] = useState(restaurant?.description || "");
  const [rating, setRating] = useState(restaurant?.rating || 0);
  const [restaurantImage, setRestaurantImage] = useState<File | null>(null);
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to submit a review.");
      return;
    }
    setIsSubmitting(true);

    const restaurantData: Partial<Restaurant> = {
      name,
      address,
      description,
      rating,
      reviewerName: user.displayName || "Anonymous",
      reviewerUid: user.uid,
    };

    try {
      let id = restaurant?.id;

      if (id) {
        await updateRestaurant(id, restaurantData);
      } else {
        id = await addRestaurant(restaurantData as Restaurant);
      }

      if (restaurantImage) {
        const restaurantImageUrl = await uploadImage(
          restaurantImage,
          `restaurants/${id}/restaurant-image`
        );
        await updateRestaurant(id, { restaurantImage: restaurantImageUrl });
      }

      if (menuImage) {
        const menuImageUrl = await uploadImage(
          menuImage,
          `restaurants/${id}/menu-image`
        );
        await updateRestaurant(id, { menuImage: menuImageUrl });
      }

      onSubmit();
      navigate("/");
    } catch (error) {
      console.error("Error submitting restaurant data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={3}
        />
      </div>
      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Rating
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="0"
          max="5"
          step="0.1"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="restaurantImage"
          className="block text-sm font-medium text-gray-700"
        >
          Restaurant Image
        </label>
        <input
          type="file"
          id="restaurantImage"
          onChange={(e) => setRestaurantImage(e.target.files?.[0] || null)}
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label
          htmlFor="menuImage"
          className="block text-sm font-medium text-gray-700"
        >
          Menu Image
        </label>
        <input
          type="file"
          id="menuImage"
          onChange={(e) => setMenuImage(e.target.files?.[0] || null)}
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isSubmitting || !user}
      >
        {isSubmitting ? "Submitting..." : restaurant ? "Update" : "Add"}{" "}
        Restaurant
      </button>
      {!user && (
        <p className="text-red-500 text-sm mt-2">
          Please sign in to submit a review.
        </p>
      )}
    </form>
  );
};

export default RestaurantForm;
