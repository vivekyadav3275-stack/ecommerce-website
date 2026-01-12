import products from "../data/Products";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ addToCart, search }) {

  // SEARCH FILTER
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid">

      {filteredProducts.map((item) => (
        <ProductCard
          key={item.id}
          product={item}
          addToCart={addToCart}
        />
      ))}

    </div>
  );
}

export default ProductGrid;
