import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviews } from "../services/ReviewService";
import { Review } from "../types/Review";
import { Comment } from "../types/Comment";
import { addComment, getComments } from "../services/CommentService";
import { getAuth } from "firebase/auth";

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const auth = getAuth();

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

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        const reviews = await getReviews();
        const foundReview = reviews.find((r) => r.id === id);
        setReview(foundReview || null);

        if (foundReview) {
          const fetchedComments = await getComments(foundReview.id);
          setComments(fetchedComments);
        }
      } catch (error) {
        console.error("Error fetching review detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const newCommentData: Comment = {
      id: Date.now().toString(),
      reviewId: id || "",
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    await addComment(newCommentData);
    setComments((prev) => [...prev, newCommentData]);
    setNewComment("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Asia/Jakarta",
      }).format(date) + " WIB"
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!review) {
    return <div>No review found.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-pastel-dark">{review.name}</h2>
      {review.restaurantImage && (
        <div>
          <img
            src={review.restaurantImage}
            alt={review.name}
            className="w-full h-48 object-cover mb-4 cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white rounded-lg shadow-lg p-4">
                <button
                  onClick={() => setIsModalOpen(false)} // Close modal
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
                <img
                  src={review.restaurantImage}
                  alt={review.name}
                  className="w-full h-auto max-w-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}
      <p className="text-gray-600 mb-2">{review.address}</p>
      <p className="text-sm text-gray-500 mb-2">{review.phoneNumber}</p>
      <p className="text-sm text-gray-500 mb-2">{review.description}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-yellow-500">{generateStars(review.rating)}</span>
        <span>{Number(review.rating).toFixed(1)}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Reviewed by: {review.reviewerName || "Anonymous"}
      </p>

      {review.menuImage && (
        <button
          onClick={() => window.open(review.menuImage, "_blank")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mb-4"
        >
          View Menu
        </button>
      )}

      {review.menuImage && (
        <button
          onClick={() => window.open(review.menuImage, "_blank")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mb-4"
        >
          View Menu
        </button>
      )}

      <div className="mt-8 bg-pastel-light p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-pastel-dark">Comments</h3>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="border border-pastel-lightDark p-4 rounded-lg bg-pastel-lightDark shadow-sm"
              >
                <p className="font-semibold text-pastel-primary">
                  {comment.username}
                </p>
                <p className="text-pastel-dark mt-2 break-words">{comment.text}</p>
                <p className="text-pastel-accent text-xs mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-pastel-dark">No comments yet.</p>
        )}

        {auth.currentUser ? (
          <form
            onSubmit={handleCommentSubmit}
            className="mt-4 bg-pastel-light p-4 rounded-lg shadow-md"
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="border border-pastel-lightDark p-3 rounded w-full focus:outline-none focus:border-pastel-accent text-pastel-dark placeholder-pastel-dark resize-none"
              required
            />
            <button
              type="submit"
              className="mt-3 w-full bg-pastel-primary text-white py-2 rounded-lg hover:bg-pastel-accent transition-colors"
            >
              Submit Comment
            </button>
          </form>
        ) : (
          <p className="mt-4 text-pastel-dark">
            You need to sign in to leave a comment. Please{" "}
            <a href="/sign-in" className="text-pastel-accent underline">
              sign in
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
