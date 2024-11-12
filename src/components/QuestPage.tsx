import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Quest } from "../types/Quest";

const QuestPage: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [quests, setQuests] = useState<Quest[]>([
    {
      title: "Create a Review",
      description: "Submit a restaurant review and earn +1 point.",
      points: 1,
    },
    {
      title: "Like 10 Reviews",
      description: "Like 10 restaurant reviews to earn +5 points.",
      points: 5,
    },
    {
      title: "Dislike 10 Reviews",
      description: "Dislike 10 restaurant reviews to earn +2 points.",
      points: 2,
    },
    {
      title: "Leave 5 Comments",
      description: "Comment on 5 different restaurant reviews to earn +2 points.",
      points: 2,
    },
    {
      title: "Complete 10 Reviews",
      description: "Write and submit 10 restaurant reviews to earn +10 points.",
      points: 10,
    },
  ]);

  const fetchUserPoints = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPoints(userData?.points || 0);
      }
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  return (
    <div className="p-6 bg-pastel-light min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-pastel-dark">Do Quest and Earn Points!</h1>


      {/* Display User Points */}
      <div className="mb-6 bg-pastel-primary p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-white">Your Points: {points}</h2>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-pastel-dark">Daily Quests</h2>
        <ul className="space-y-4">
          {quests.map((quest, index) => (
            <li
              key={index}
              className="border border-pastel-lightDark p-4 rounded-lg shadow-sm bg-white transition-all transform hover:-translate-y-1"
            >
              <h3 className="font-bold text-lg text-pastel-primary">{quest.title}</h3>
              <p className="text-pastel-dark">{quest.description}</p>
              <p className="text-pastel-accent font-medium">Reward: {quest.points} points</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestPage;
