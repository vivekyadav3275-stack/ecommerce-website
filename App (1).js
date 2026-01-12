import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";

function App() {

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  // ADD TO CART (stock + quantity safe)
  const addToCart = (product) => {

    const exist = cart.find(i => i.id === product.id);

    if (exist) {
      if (exist.qty >= product.stock) {
        alert("Out of stock!");
        return;
      }

      setCart(
        cart.map(i =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );

    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  // TOTAL ITEMS
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
      />

      {/* ROUTES */}
      <Routes>

        <Route
          path="/"
          element={
            <ProductGrid
              addToCart={addToCart}
              search={search}
            />
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
            />
          }
        />

      </Routes>
    </>
  );
}

export default App;
