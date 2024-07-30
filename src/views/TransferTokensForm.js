import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import './transferTokensForm.scss'; 

const { Title, Text } = Typography;

const TransferTokensForm = ({ transferData, handleInputChange, handleTransferTokens }) => {
  return (
    <div className="transfer-tokens-form">
      <Title level={3} style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Transfer Tokens</Title>
      <Form onFinish={handleTransferTokens} layout="vertical">
        <Form.Item
          label={<Text style={{ color: 'white' }}>Network Name</Text>}
          name="network_name"
          rules={[{ required: true, message: 'Please input the network name!' }]}
        >
          <Input value={transferData.network_name} onChange={handleInputChange} name="network_name" />
        </Form.Item>
        <Form.Item
          label={<Text style={{ color: 'white' }}>Token Address</Text>}
          name="token_address"
          rules={[{ required: true, message: 'Please input the token address!' }]}
        >
          <Input value={transferData.token_address} onChange={handleInputChange} name="token_address" />
        </Form.Item>
        <Form.Item
          label={<Text style={{ color: 'white' }}>Quantity</Text>}
          name="quantity"
          rules={[{ required: true, message: 'Please input the quantity!' }]}
        >
          <Input value={transferData.quantity} onChange={handleInputChange} name="quantity" />
        </Form.Item>
        <Form.Item
          label={<Text style={{ color: 'white' }}>Recipient Address</Text>}
          name="recipient_address"
          rules={[{ required: true, message: 'Please input the recipient address!' }]}
        >
          <Input value={transferData.recipient_address} onChange={handleInputChange} name="recipient_address" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Transfer Tokens
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TransferTokensForm;
