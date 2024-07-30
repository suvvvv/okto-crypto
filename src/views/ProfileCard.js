import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import './ProfileCard.scss';

const { Title, Text } = Typography;

const ProfileCard = ({ userDetails, setActiveSection }) => {
  const formatDate = (epoch) => {
    const date = new Date(epoch * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="profile-card">
      <div className="user-details">
        <p><Text strong>Email:</Text> {userDetails.email}</p>
        <p><Text strong>User ID:</Text> {userDetails.user_id}</p>
        <p><Text strong>Joined:</Text> {formatDate(userDetails.created_at)}</p>
      </div>
      <div className="dashboard">
        <Title level={4} className="title-white" style={{ textAlign: 'center', marginTop: '40px' }}>Quick Access</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card className="dashboard-card" onClick={() => setActiveSection('portfolio')}>
              <div className="card-content">
                <div className="card-title">
                  <Title level={5}>Portfolio</Title>
                  <ArrowRightOutlined className="arrow-icon" />
                </div>
                <Text>View and manage your portfolio.</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dashboard-card" onClick={() => setActiveSection('wallets')}>
              <div className="card-content">
                <div className="card-title">
                  <Title level={5}>Wallets</Title>
                  <ArrowRightOutlined className="arrow-icon" />
                </div>
                <Text>Access your wallets and balances.</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dashboard-card" onClick={() => setActiveSection('transferTokens')}>
              <div className="card-content">
                <div className="card-title">
                  <Title level={5}>Transfer Tokens</Title>
                  <ArrowRightOutlined className="arrow-icon" />
                </div>
                <Text>Send tokens to another address.</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dashboard-card" onClick={() => setActiveSection('orderStatus')}>
              <div className="card-content">
                <div className="card-title">
                  <Title level={5}>Check Order Status</Title>
                  <ArrowRightOutlined className="arrow-icon" />
                </div>
                <Text>View your order history and status.</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfileCard;
