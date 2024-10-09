import React, { useState, useEffect } from "react";
import { getReviews } from "../services/ReviewService";
import Modal from "react-modal";
import { Review } from "../types/Review";

const RoulettePage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [randomReview, setRandomReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  const handleRoulette = () => {
    if (reviews.length > 0) {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      setRandomReview(reviews[randomIndex]);
      setIsModalOpen(true);
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

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Roulette Review</h2>
      <button
        onClick={handleRoulette}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition-colors"
      >
        Spin the Roulette!
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {randomReview && (
          <div className="p-4">
            {randomReview.restaurantImage && (
              <img
                src={randomReview.restaurantImage}
                alt={randomReview.name}
                className="w-full h-48 object-cover"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{randomReview.name}</h3>
            <p className="text-gray-600 mb-2">{randomReview.address}</p>
            <p className="text-gray-600 mb-2">{randomReview.phoneNumber}</p>
            <p className="text-sm text-gray-500 mb-2">
              {randomReview.description}
            </p>
            <span className="text-yellow-500">
              {generateStars(randomReview.rating)}
            </span>
            <span>{Number(randomReview.rating).toFixed(1)}</span>
            <p className="text-sm text-gray-600 mb-2">
              Reviewed by: {randomReview.reviewerName || "Anonymous"}
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoulettePage;
