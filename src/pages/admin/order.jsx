import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../store/order/orderSlice'; 

const Order = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className="order-container">
      <h1 className='text-center'>Order Details</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <h2>Order ID: {order._id}</h2>
            <table className="order-table">
              <thead>
                <tr>
                  <th colSpan="2">Order Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Created at:</strong></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Payment Method:</strong></td>
                  <td>{order.paymentMethod}</td>
                </tr>
                <tr>
                  <td><strong>Total Amount:</strong></td>
                  <td>${order.totalAmount}</td>
                </tr>
              </tbody>
            </table>

            <h3>Shipping Address</h3>
            <table className="address-table">
              <tbody>
                <tr>
                  <td><strong>Full Name:</strong></td>
                  <td>{order.shippingAddress.fullName}</td>
                </tr>
                <tr>
                  <td><strong>Street Address:</strong></td>
                  <td>{order.shippingAddress.streetAddress}</td>
                </tr>
                <tr>
                  <td><strong>City:</strong></td>
                  <td>{order.shippingAddress.city}</td>
                </tr>
                <tr>
                  <td><strong>Country:</strong></td>
                  <td>{order.shippingAddress.country}</td>
                </tr>
                <tr>
                  <td><strong>Zip Code:</strong></td>
                  <td>{order.shippingAddress.zipCode}</td>
                </tr>
              </tbody>
            </table>

            <h3>Products</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-status">
              <h3>Order Status</h3>
              <p>Status: {order.status || 'Pending'}</p>
              <button 
                className="status-btn" 
                onClick={() => handleStatusChange(order._id, 'Shipped')}
              >
                Mark as Shipped
              </button>
              <button 
                className="status-btn" 
                onClick={() => handleStatusChange(order._id, 'Delivered')}
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
