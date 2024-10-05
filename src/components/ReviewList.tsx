import React, { useEffect, useState } from "react";
import { Review } from "../types/Review";
import { getReviews, deleteReview } from "../services/ReviewService";
import EditReview from "./EditReview";

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
    fetchReviews();
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleSave = async () => {
    await fetchReviews();
    setEditingReview(null);
  };

  const handleCancel = () => {
    setEditingReview(null);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Review List</h2>
      {editingReview ? (
        <EditReview
          review={editingReview}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {review.restaurantImage && (
                <img
                  src={review.restaurantImage}
                  alt={review.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{review.name}</h3>
                <p className="text-gray-600 mb-2">{review.address}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {review.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-500">
                    {"★".repeat(Math.round(review.rating))}
                    {"☆".repeat(5 - Math.round(review.rating))}
                  </span>
                  <span>{Number(review.rating).toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Reviewed by: {review.reviewerName || "Anonymous"}
                </p>
                {review.menuImage && (
                  <button
                    onClick={() => window.open(review.menuImage, "_blank")}
                    className="text-blue-500 underline text-sm mb-2"
                  >
                    View Menu
                  </button>
                )}
                <button
                  onClick={() => handleEdit(review)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => review.id && handleDelete(review.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
