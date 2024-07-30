import React, { useEffect, useState } from 'react';
import {  Button, Input, Form, Modal } from 'antd';
import './OrderStatus.scss'; 



const OrderStatus = ({ orderData, handleInputChangeOrders, handleOrderCheck, orderResponse }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log("Current Order Data:", orderData);
  }, [orderData]);

  useEffect(() => {
    if (orderResponse) {
      setIsModalVisible(true);
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
        <Modal title="Order Details" visible={isModalVisible} onOk={handleOk} onCancel={handleOk}>
          <p>Order ID: {orderResponse?.order_id}</p>
          <p>Order Type: {orderResponse?.order_type}</p>
          <p>Order Status: {orderResponse?.status}</p>
          <p>Order Transaction Hash: {orderResponse?.transaction_hash}</p>
          <p>Order Network Name: {orderResponse?.network_name}</p>
        </Modal>
      </div>
    </div>
  );
};

export default OrderStatus;
