function ProductCard({ product, addToCart }) {

  const handleBuy = () => {
    alert(`Buying: ${product.name}`);
  };

  return (
    <div className="product-card">

      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <p>Stock: {product.stock}</p>

      {/* BUY NOW */}
      <button 
        className="buy-btn"
        onClick={handleBuy}
      >
        Buy Now
      </button>

      {/* ADD TO CART */}
      <button 
        className="cart-btn"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;
