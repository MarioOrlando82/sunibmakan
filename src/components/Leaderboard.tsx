import React, { useEffect, useState } from "react";
import { Review } from "../types/Review";
import { getReviews } from "../services/ReviewService";
import { LeaderboardUser } from "../types/LeaderboardUser";

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    const reviews = await getReviews();

    const userReviewCount: { [key: string]: LeaderboardUser } = {};

    reviews.forEach((review: Review) => {
      if (userReviewCount[review.userId]) {
        userReviewCount[review.userId].reviewCount += 1;
      } else {
        userReviewCount[review.userId] = {
          userId: review.userId,
          username: review.reviewerName || "Anonymous",
          reviewCount: 1,
        };
      }
    });

    const sortedLeaderboard = Object.values(userReviewCount).sort(
      (a, b) => b.reviewCount - a.reviewCount
    );

    setLeaderboard(sortedLeaderboard.slice(0, 10));
  };

  return (
    <div className="container mx-auto mt-8 bg-pastel-light rounded-lg shadow-lg p-3">
      <h2 className="text-3xl font-bold mb-4 text-center pt-3 text-pastel-dark">Leaderboard</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 bg-pastel-lightDark text-pastel-dark">Rank</th>
            <th className="py-2 bg-pastel-lightDark text-pastel-dark">User</th>
            <th className="py-2 bg-pastel-lightDark text-pastel-dark">Reviews</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={user.userId}
              className={`${
                index === 0
                  ? "bg-pastel-gold text-pastel-dark font-bold"
                  : index === 1
                  ? "bg-pastel-silver text-pastel-dark font-semibold"
                  : index === 2
                  ? "bg-pastel-bronze text-pastel-dark font-semibold"
                  : "bg-white text-pastel-dark"
              } border-b border-pastel-lightDark`}
            >
              <td className="py-4 px-6 text-center text-xl">{index + 1}</td>
              <td className="py-4 px-6 text-left">{user.username}</td>
              <td className="py-4 px-6 text-center text-lg">{user.reviewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
