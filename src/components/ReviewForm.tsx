import React, { useState, useEffect } from "react";
import { Review } from "../types/Review";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import {
  addReview,
  updateReview,
  uploadImage,
} from "../services/ReviewService";

interface Props {
  review?: Review;
  onSubmit: () => void;
}

const ReviewForm: React.FC<Props> = ({ review, onSubmit }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [name, setName] = useState(review?.name || "");
  const [address, setAddress] = useState(review?.address || "");
  const [description, setDescription] = useState(review?.description || "");
  const [rating, setRating] = useState(review?.rating || 0);
  const [restaurantImage, setRestaurantImage] = useState<File | null>(null);
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(review?.phoneNumber || "");
  const [restaurantImagePreview, setRestaurantImagePreview] = useState<
    string | null
  >(review?.restaurantImage || null);
  const [menuImagePreview, setMenuImagePreview] = useState<string | null>(
    review?.menuImage || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setRestaurantImagePreview(review.restaurantImage || null);
      setMenuImagePreview(review.menuImage || null);
    }
  }, [review]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to submit a review.");
      return;
    }
    setIsSubmitting(true);

    const reviewData: Omit<Review, "id"> = {
      name,
      address,
      description,
      rating,
      reviewerName: user.displayName || "Anonymous",
      userId: user.uid,
      restaurantImage: restaurantImagePreview || "",
      menuImage: menuImagePreview || "",
      likedBy: [],
      dislikedBy: [],
      likes: 0,
      dislikes: 0,
      phoneNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      let id = review?.id;

      if (id) {
        await updateReview(id, reviewData);
      } else {
        id = await addReview(reviewData);
      }

      if (restaurantImage) {
        const restaurantImageUrl = await uploadImage(
          restaurantImage,
          `restaurants/${id}/restaurant-image`
        );
        await updateReview(id, {
          ...reviewData,
          restaurantImage: restaurantImageUrl,
        });
      }

      if (menuImage) {
        const menuImageUrl = await uploadImage(
          menuImage,
          `restaurants/${id}/menu-image`
        );
        await updateReview(id, { ...reviewData, menuImage: menuImageUrl });
      }

      onSubmit();
      navigate("/");
    } catch (error) {
      console.error("Error submitting review data:", error);
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
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="number"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          onChange={(e) =>
            handleImageChange(e, setRestaurantImage, setRestaurantImagePreview)
          }
          accept="image/*"
          className="mt-1 block w-full"
        />
        {restaurantImagePreview && (
          <img
            src={restaurantImagePreview}
            alt="Restaurant preview"
            className="mt-2 w-full h-48 object-cover"
          />
        )}
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
          onChange={(e) =>
            handleImageChange(e, setMenuImage, setMenuImagePreview)
          }
          accept="image/*"
          className="mt-1 block w-full"
        />
        {menuImagePreview && (
          <img
            src={menuImagePreview}
            alt="Menu preview"
            className="mt-2 w-full h-48 object-cover"
          />
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isSubmitting || !user}
      >
        {isSubmitting ? "Submitting..." : review ? "Update" : "Add"} Review
      </button>
      {!user && (
        <p className="text-red-500 text-sm mt-2">
          Please sign in to submit a review.
        </p>
      )}
    </form>
  );
};

export default ReviewForm;
