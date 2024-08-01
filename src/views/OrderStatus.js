import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Modal } from 'antd';
import './OrderStatus.scss';

const OrderStatus = ({ orderData, setOrderData, handleInputChangeOrders, handleOrderCheck, orderResponse, setOrderResponse }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    console.log("Order Response changed:", orderResponse);
    if (orderResponse && orderResponse.jobs && orderResponse.jobs.length > 0) {
      const jobDetails = orderResponse.jobs[0];
      console.log("Order Details:", jobDetails);
      setOrderDetails(jobDetails);
      setIsModalVisible(true);
    } else {
      console.log("Order Response is null or empty.");
      setOrderDetails(null);
      setIsModalVisible(false);
    }
  }, [orderResponse]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="order-status-container">
      <div className="form-wrapper">
        <Form onFinish={handleOrderCheck} layout="inline" style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Form.Item
            name="order_id"
            rules={[{ required: true, message: 'Please input the Order Id!' }]}
          >
            <Input
              name="order_id"
              placeholder="Order Id"
              value={orderData.order_id}
              onChange={handleInputChangeOrders}
              style={{ textAlign: 'center', width: '500px', height: '50px', fontSize: '20px', borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: '10px', height: '50px' }}>
              Check Status
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="Order Details"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleOk}
          destroyOnClose={true} // Ensure the modal is destroyed on close
        >
          {orderDetails ? (
            <>
              <p>Order ID: {orderDetails.order_id}</p>
              <p>Order Type: {orderDetails.order_type}</p>
              <p>Order Status: {orderDetails.status}</p>
              <p>Order Transaction Hash: {orderDetails.transaction_hash}</p>
              <p>Order Network Name: {orderDetails.network_name}</p>
            </>
          ) : (
            <p>No order details available.</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrderStatus;
