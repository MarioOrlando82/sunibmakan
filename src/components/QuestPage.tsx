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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quest Page</h1>

      {/* Display User Points */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Your Points: {points}</h2>
      </div>

      {/* List of Quests */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Quests</h2>
        <ul className="space-y-2">
          {quests.map((quest, index) => (
            <li
              key={index}
              className="border p-2 rounded-lg shadow-md bg-white"
            >
              <h3 className="font-bold text-lg">{quest.title}</h3>
              <p>{quest.description}</p>
              <p className="text-green-500">Reward: {quest.points} points</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestPage;
