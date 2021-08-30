import React, { useState, useEffect } from 'react';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import Products from './Products';
import { Routes, Route } from 'react-router-dom';
import Detail from './Detail';
import Cart from './Cart';

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) ?? [];
    } catch {
      console.error('The cart could not be parsed into JSON.');
      return [];
    }
  });

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  const addToCart = (id, sku) => {
    //Callback function when referencing existing state because state calls are async
    //React will provide current state as the argument when we use a function to set state
    setCart((items) => {
      const itemInCart = items.find((i) => i.sku === sku);
      if (itemInCart) {
        //return new array with the matching item replaced
        return items.map((i) => {
          return i.sku === sku ? { ...i, quantity: i.quantity + 1 } : i;
        });
      } else {
        //return new array with the new item appended
        return [...items, { id, sku, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (sku, quantity) => {
    setCart((items) => {
      return quantity !== 0
        ? items.map((i) => (i.sku === sku ? { ...i, quantity } : i))
        : items.filter((i) => i.sku !== sku);
    });
  };
  return (
    <>
      <div className='content'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<h1>Welcome to Carved Rock Fitness</h1>} />
            <Route path='/:category' element={<Products />} />
            <Route
              path='/:category/:id'
              element={<Detail addToCart={addToCart} />}
            />
            <Route
              path='/cart'
              element={<Cart cart={cart} updateQuantity={updateQuantity} />}
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}
