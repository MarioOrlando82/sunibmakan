import React, { useState } from "react";
import RestaurantList from "./components/RestaurantList";
import RestaurantForm from "./components/RestaurantForm";

const App: React.FC = () => {
  const [refreshList, setRefreshList] = useState(false);

  const handleFormSubmit = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Restaurant Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Restaurant</h2>
          <RestaurantForm onSubmit={handleFormSubmit} />
        </div>
        <div>
          <RestaurantList key={refreshList ? "refresh" : "no-refresh"} />
        </div>
      </div>
    </div>
  );
};

export default App;
