import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000'); // Connect to the Socket.IO server

const App = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetchDishes();

    // Listen for real-time updates
    socket.on('dish_status_changed', (updatedDish) => {
      console.log("socket on");
      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.dishId === updatedDish.dishId ? updatedDish : dish
        )
      );
    });

   
  }, []);


  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const togglePublished = async (dishId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/dishes/toggle/${dishId}`);
      if (response.data.success) {
        setDishes(dishes.map(dish =>
          dish.dishId === dishId ? { ...dish, isPublished: response.data.isPublished } : dish
        ));
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Dish Dashboard</h1>
      <div className="dish-container">
        {dishes.map((dish) => (
          <div key={dish.dishId} className="dish-card">
            <img src={dish.imageUrl} alt={dish.dishName} className="dish-image" />
            <h2>{dish.dishName}</h2>
            <p>{dish.isPublished ? 'Published' : 'Not Published'}</p>
            <button onClick={() => togglePublished(dish.dishId)} className="toggle-button">
              {dish.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
