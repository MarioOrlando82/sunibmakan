import React, { useEffect, useState } from "react";
import { Review } from "../types/Review";
import {
  getReviews,
  deleteReview,
  likeReview,
  dislikeReview,
} from "../services/ReviewService";
import EditReview from "./EditReview";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchReviews();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  const handleDelete = async (id: string) => {
    if (
      currentUser &&
      currentUser.uid === reviews.find((r) => r.id === id)?.userId
    ) {
      await deleteReview(id);
      fetchReviews();
    } else {
      alert("You don't have permission to delete this review.");
    }
  };

  const handleEdit = (review: Review) => {
    if (currentUser && currentUser.uid === review.userId) {
      setEditingReview(review);
    } else {
      alert("You don't have permission to edit this review.");
    }
  };

  const handleSave = async () => {
    await fetchReviews();
    setEditingReview(null);
  };

  const handleLike = async (id: string) => {
    try {
      await likeReview(id);
      fetchReviews();
    } catch (error: any) {
      alert(error.message || "An error occurred while liking the review.");
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await dislikeReview(id);
      fetchReviews();
    } catch (error: any) {
      alert(error.message || "An error occurred while disliking the review.");
    }
  };

  const generateStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {"★".repeat(fullStars)}
        {"½".repeat(halfStars)}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Review List</h2>
      <input
        type="text"
        placeholder="Search reviews by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />
      {editingReview ? (
        <EditReview
          review={editingReview}
          onSave={handleSave}
          onCancel={() => setEditingReview(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow rounded-lg overflow-hidden p-4"
            >
              {review.restaurantImage && (
                <img
                  src={review.restaurantImage}
                  alt={review.name}
                  className="w-full h-48 object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{review.name}</h3>
              <p className="text-gray-600 mb-2">{review.address}</p>
              <p className="text-sm text-gray-500 mb-2">{review.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-500">
                  {generateStars(review.rating)}
                </span>
                <span>{Number(review.rating).toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Reviewed by: {review.reviewerName || "Anonymous"}
              </p>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => handleLike(review.id)}
                    disabled={review.likedBy.includes(currentUser?.uid || "")}
                    className={`bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors mr-2 ${
                      review.likedBy.includes(currentUser?.uid || "")
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    👍 {review.likes}
                  </button>
                  <button
                    onClick={() => handleDislike(review.id)}
                    disabled={review.dislikedBy.includes(
                      currentUser?.uid || ""
                    )}
                    className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors ${
                      review.dislikedBy.includes(currentUser?.uid || "")
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    👎 {review.dislikes}
                  </button>
                </div>
              </div>

              {currentUser && currentUser.uid === review.userId && (
                <div className="flex space-x-2">
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
