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
import { Link } from "react-router-dom";

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 6;

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
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

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

  const handleCancel = () => {
    setEditingReview(null);
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

  const handleLike = async (id: string) => {
    if (!currentUser) {
      alert("You must be logged in to like a review.");
      return;
    }
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

  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch = review.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const now = new Date();
      const reviewDate = new Date(review.createdAt);

      const last24Hours = new Date(now);
      last24Hours.setDate(now.getDate() - 1);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const startOfYear = new Date(now.getFullYear(), 0, 1);

      let matchesTimeFilter = true;

      if (filterOption === "last-24-hours") {
        matchesTimeFilter = reviewDate >= last24Hours;
      } else if (filterOption === "this-week") {
        matchesTimeFilter = reviewDate >= startOfWeek;
      } else if (filterOption === "this-month") {
        matchesTimeFilter = reviewDate >= startOfMonth;
      } else if (filterOption === "this-year") {
        matchesTimeFilter = reviewDate >= startOfYear;
      }

      return matchesSearch && matchesTimeFilter;
    })
    .sort((a, b) => {
      if (filterOption === "most-liked") {
        return b.likes - a.likes;
      } else if (filterOption === "least-liked") {
        return a.likes - b.likes;
      } else if (filterOption === "recent") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (filterOption === "all") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto mt-8">
      {!editingReview && (
        <>
          <h2 className="text-2xl font-bold mb-4">Review List</h2>
          <input
            type="text"
            placeholder="Search reviews by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full shadow-sm"
          />
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 shadow-sm"
          >
            <option value="all">All Reviews</option>
            <option value="recent">Most Recent</option>
            <option value="most-liked">Most Liked</option>
            <option value="least-liked">Least Liked</option>
            <option value="last-24-hours">Last 24 Hours</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
          </select>
        </>
      )}

      {editingReview ? (
        <EditReview
          review={editingReview}
          onSave={handleSave}
          onCancel={() => setEditingReview(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow-md rounded-lg overflow-hidden p-4"
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
                <p className="text-gray-600 mb-2">{review.phoneNumber}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {review.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-yellow-500">
                      {generateStars(review.rating)}
                    </span>
                  </div>
                  <span>{Number(review.rating).toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Reviewed by: {review.reviewerName || "Anonymous"}
                </p>

                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    disabled={review.likedBy.includes(currentUser?.uid || "")}
                    className={`bg-pastel-primary text-white px-4 py-2 rounded hover:bg-pastel-accent transition-colors mr-2 ${
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
                    className={`bg-pastel-dark text-white px-4 py-2 rounded hover:bg-pastel-accent transition-colors ${
                      review.dislikedBy.includes(currentUser?.uid || "")
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    👎 {review.dislikes}
                  </button>
                </div>

                <Link
                  to={`/review/${review.id}`}
                  className="mt-2 mb-2 bg-pastel-primary text-white px-4 py-2 rounded hover:bg-pastel-accent transition-colors w-full text-center"
                >
                  Detail
                </Link>

                {currentUser && currentUser.uid === review.userId && (
                  <>
                    <button
                      onClick={() => handleEdit(review)}
                      className="mt-4 bg-pastel-primary text-white px-4 py-2 rounded hover:bg-pastel-accent transition-colors w-full"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => review.id && handleDelete(review.id)}
                      className="mt-2 bg-pastel-dark text-white px-4 py-2 rounded hover:bg-pastel-accent transition-colors w-full"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!editingReview && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-pastel-primary text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
