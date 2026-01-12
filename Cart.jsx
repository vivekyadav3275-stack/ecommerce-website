import "./Cart.css";

function Cart({ cart, removeFromCart }) {

  // TOTAL PRICE
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-page">

      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (

        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">

              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <p>Qty: {item.qty}</p>

                {/* REMOVE BUTTON */}
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

          <h3>Total: ₹{total}</h3>
        </>
      )}

    </div>
  );
}

export default Cart;
