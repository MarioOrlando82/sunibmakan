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
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Rank</th>
            <th className="py-2">User</th>
            <th className="py-2">Reviews</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.userId} className="border-t">
              <td className="py-2 px-4 text-center">{index + 1}</td>
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4 text-center">{user.reviewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
