import React, { useState, useEffect } from "react";
import { Review } from "../types/Review";
import { updateReview, uploadImage } from "../services/ReviewService";
import { getAuth } from "firebase/auth";

interface EditReviewProps {
  review: Review;
  onSave: () => void;
  onCancel: () => void;
}

const EditReview: React.FC<EditReviewProps> = ({ review, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Review, "id" | "userId" | "reviewerName">>({
    name: "",
    address: "",
    description: "",
    rating: 0,
    restaurantImage: "",
    menuImage: "",
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    phoneNumber: "",
    createdAt: "",
  });

  useEffect(() => {
    setFormData({
      name: review.name,
      address: review.address,
      description: review.description,
      rating: review.rating,
      restaurantImage: review.restaurantImage,
      menuImage: review.menuImage,
      likes: review.likes,
      dislikes: review.dislikes,
      likedBy: review.likedBy,
      dislikedBy: review.dislikedBy,
      phoneNumber: review.phoneNumber,
      createdAt: review.createdAt,
    });
  }, [review]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: "restaurantImage" | "menuImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const path = `images/${imageType}/${file.name}`;
      const imageUrl = await uploadImage(file, path);
      setFormData((prev) => ({ ...prev, [imageType]: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (review.id && user) {
      const updatedReview: Review = {
        ...formData,
        id: review.id,
        userId: user.uid,
        reviewerName: user.displayName || "Anonymous",
      };
      await updateReview(review.id, updatedReview);
      onSave();
    } else {
      console.error("User not logged in or review ID is missing");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-pastel-light p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-pastel-dark text-center">Edit Review</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-pastel-dark">
          Restaurant Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-pastel-primary bg-pastel-lightDark shadow-sm focus:border-pastel-accent focus:ring focus:ring-pastel-accent focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-pastel-dark">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-pastel-primary bg-pastel-lightDark shadow-sm focus:border-pastel-accent focus:ring focus:ring-pastel-accent focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-pastel-dark">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-pastel-primary bg-pastel-lightDark shadow-sm focus:border-pastel-accent focus:ring focus:ring-pastel-accent focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-pastel-dark">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-pastel-primary bg-pastel-lightDark shadow-sm focus:border-pastel-accent focus:ring focus:ring-pastel-accent focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-pastel-dark">
          Rating
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-pastel-primary bg-pastel-lightDark shadow-sm focus:border-pastel-accent focus:ring focus:ring-pastel-accent focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="restaurantImage" className="block text-sm font-medium text-pastel-dark">
          Restaurant Image
        </label>
        <input
          type="file"
          id="restaurantImage"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "restaurantImage")}
          className="hidden" // Hide the original input
        />
        <label
          htmlFor="restaurantImage"
          className="mt-1 inline-block cursor-pointer bg-pastel-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-pastel-accent transition-colors"
        >
          Choose File
        </label>
        {formData.restaurantImage && (
          <img src={formData.restaurantImage} alt="Restaurant" className="mt-2 w-full h-48 object-cover" />
        )}
      </div>
      <div>
        <label htmlFor="menuImage" className="block text-sm font-medium text-pastel-dark">
          Menu Image
        </label>
        <input
          type="file"
          id="menuImage"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "menuImage")}
          className="hidden" // Hide the original input
        />
        <label
          htmlFor="menuImage"
          className="mt-1 inline-block cursor-pointer bg-pastel-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-pastel-accent transition-colors"
        >
          Choose File
        </label>
        {formData.menuImage && (
          <img src={formData.menuImage} alt="Menu" className="mt-2 w-full h-48 object-cover" />
        )}
      </div>

      {/* Save and Cancel buttons */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-pastel-primary hover:bg-pastel-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditReview;
