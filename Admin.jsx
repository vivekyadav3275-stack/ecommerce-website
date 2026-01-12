import { useState } from "react";

function Admin({ products, setProducts }) {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // ADD PRODUCT
  const addProduct = () => {
    if (!name || !price || !stock) return alert("Fill all fields");

    const newProduct = {
      id: Date.now(),
      name,
      price,
      stock,
      image: ""
    };

    setProducts([...products, newProduct]);

    setName(""); setPrice(""); setStock("");
  };

  // DELETE PRODUCT
  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div style={{padding:"20px"}}>

      <h2>ADMIN PANEL</h2>

      <input placeholder="Name" value={name}
        onChange={e=>setName(e.target.value)} />

      <input placeholder="Price" value={price}
        onChange={e=>setPrice(e.target.value)} />

      <input placeholder="Stock" value={stock}
        onChange={e=>setStock(e.target.value)} />

      <button onClick={addProduct}>ADD PRODUCT</button>

      <hr/>

      {products.map(p=>(
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={()=>deleteProduct(p.id)}>DELETE</button>
        </div>
      ))}

    </div>
  );
}

export default Admin;
