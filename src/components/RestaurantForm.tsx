import React, { useState } from "react";
import { Restaurant } from "../types/Restaurant";
import { addRestaurant, updateRestaurant } from "../services/RestaurantService";

interface Props {
  restaurant?: Restaurant;
  onSubmit: () => void;
}

const RestaurantForm: React.FC<Props> = ({ restaurant, onSubmit }) => {
  const [name, setName] = useState(restaurant?.name || "");
  const [address, setAddress] = useState(restaurant?.address || "");
  const [cuisine, setCuisine] = useState(restaurant?.cuisine || "");
  const [rating, setRating] = useState(restaurant?.rating || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Restaurant = { name, address, cuisine, rating };
    if (restaurant?.id) {
      await updateRestaurant(restaurant.id, data);
    } else {
      await addRestaurant(data);
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="cuisine"
          className="block text-sm font-medium text-gray-700"
        >
          Cuisine
        </label>
        <input
          type="text"
          id="cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Rating
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="0"
          max="5"
          step="0.1"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {restaurant ? "Update" : "Add"} Restaurant
      </button>
    </form>
  );
};

export default RestaurantForm;
