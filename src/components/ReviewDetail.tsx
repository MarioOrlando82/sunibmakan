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
        console.log("Found review:", foundReview);
        setReview(foundReview || null);

        if (foundReview) {
          const fetchedComments = await getComments(foundReview.id);
          console.log("Fetched comments:", fetchedComments);
          setComments(fetchedComments);
        } else {
          console.warn("No review found with the given ID");
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
      createdAt: new Date(),
    };

    await addComment(newCommentData);
    setComments((prev) => [...prev, newCommentData]);
    setNewComment("");
  };

  const formatDate = (date: Date) => {
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
      <h2 className="text-2xl font-bold mb-4">{review.name}</h2>
      {review.restaurantImage && (
        <img
          src={review.restaurantImage}
          alt={review.name}
          className="w-full h-48 object-cover mb-4"
        />
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

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-4 rounded-lg">
                <p className="font-semibold">{comment.username}</p>
                <p className="text-gray-700">{comment.text}</p>
                <p className="text-gray-500 text-sm">
                  {formatDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        {auth.currentUser ? (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="border p-2 rounded w-full"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Submit Comment
            </button>
          </form>
        ) : (
          <p className="mt-4 text-gray-500">
            You need to sign in to leave a comment. Please{" "}
            <a href="/sign-in" className="text-blue-500 underline">
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
