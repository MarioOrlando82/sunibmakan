import React, { useState, useEffect } from "react";
import { Review } from "../types/Review";
import { updateReview, uploadImage } from "../services/ReviewService";
import { getAuth } from "firebase/auth";

interface EditReviewProps {
  review: Review;
  onSave: () => void;
  onCancel: () => void;
}

const EditReview: React.FC<EditReviewProps> = ({
  review,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<
    Omit<Review, "id" | "userId" | "reviewerName">
  >({
    name: "",
    address: "",
    description: "",
    rating: 0,
    restaurantImage: "",
    menuImage: "",
  });

  useEffect(() => {
    setFormData({
      name: review.name,
      address: review.address,
      description: review.description,
      rating: review.rating,
      restaurantImage: review.restaurantImage,
      menuImage: review.menuImage,
    });
  }, [review]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "restaurantImage" | "menuImage"
  ) => {
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
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Restaurant Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="address"
        >
          Address
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="rating"
        >
          Rating
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="rating"
          type="number"
          name="rating"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="restaurantImage"
        >
          Restaurant Image
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="restaurantImage"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "restaurantImage")}
        />
        {formData.restaurantImage && (
          <img
            src={formData.restaurantImage}
            alt="Restaurant"
            className="mt-2 w-full h-48 object-cover"
          />
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="menuImage"
        >
          Menu Image
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="menuImage"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "menuImage")}
        />
        {formData.menuImage && (
          <img
            src={formData.menuImage}
            alt="Menu"
            className="mt-2 w-full h-48 object-cover"
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save Changes
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditReview;
