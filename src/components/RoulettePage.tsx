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
      <h2 className="text-2xl font-bold mb-4  text-pastel-dark">Roulette Review</h2>
      <button
        onClick={handleRoulette}
        className="bg-pastel-primary text-white px-4 py-2 rounded-lg mb-4 hover:bg-pastel-accent transition-colors"
      >
        Spin the Roulette!
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 z-40"
      >
        {randomReview && (
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
            {randomReview.restaurantImage && (
              <img
                src={randomReview.restaurantImage}
                alt={randomReview.name}
                className="w-full h-48 object-cover rounded-t-lg"
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
            <span className="ml-2">{Number(randomReview.rating).toFixed(1)}</span>
            <p className="text-sm text-gray-600 mb-2">
              Reviewed by: {randomReview.reviewerName || "Anonymous"}
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-pastel-primary text-white px-4 py-2 rounded-lg hover:bg-pastel-accent transition-colors w-full"
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
