import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchInventory 
} from "../../store/inventory/inventorySlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  console.log("Inventory items:", items);

  if (status === "loading") return <p>Loading inventory data...</p>;
  if (status === "failed") return <p>Error fetching inventory: {error}</p>;

  return (
    <div>
      <h2>Inventory Management</h2>
      {items.length === 0 ? (
        <p>No inventory data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Category</th>
              <th>Items Received</th>
              <th>Quantity Received</th>
              <th>Sold Items</th>
              <th>Balance Stock</th>
              <th>Amount Sold</th>
              <th>Supplier</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.brand}</td>
                <td>{item.category}</td>
                <td>{item.items_received}</td>
                <td>{item.quantity_received}</td>
                <td>{item.sold_items}</td>
                <td>{item.balance_stock}</td>
                <td>${item.amount_sold?.toFixed(2)}</td> {/* ✅ Added optional chaining to avoid errors */}
                <td>{item.suppliers_name}</td>
                <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td> {/* ✅ Added a check to avoid invalid dates */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;
