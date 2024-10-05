import React, { useEffect, useState } from "react";
import { Restaurant } from "../types/Restaurant";
import {
  getRestaurants,
  deleteRestaurant,
} from "../services/RestaurantService";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };

  const handleDelete = async (id: string) => {
    await deleteRestaurant(id);
    fetchRestaurants();
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Restaurant List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {restaurant.restaurantImage && (
              <img
                src={restaurant.restaurantImage}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-2">{restaurant.address}</p>
              <p className="text-sm text-gray-500 mb-2">
                {restaurant.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(restaurant.rating))}
                  {"☆".repeat(5 - Math.round(restaurant.rating))}
                </span>
                <span className="text-gray-600">
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Reviewed by: {restaurant.reviewerName || "Anonymous"}
              </p>
              {restaurant.menuImage && (
                <button
                  onClick={() => window.open(restaurant.menuImage, "_blank")}
                  className="text-blue-500 underline text-sm mb-2"
                >
                  View Menu
                </button>
              )}
              <button
                onClick={() => restaurant.id && handleDelete(restaurant.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
