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
      <ul className="space-y-4">
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <p>{restaurant.address}</p>
            <p>Cuisine: {restaurant.cuisine}</p>
            <p>Rating: {restaurant.rating}</p>
            <button
              onClick={() => restaurant.id && handleDelete(restaurant.id)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
