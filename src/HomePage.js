import React, { useState, useEffect, useCallback } from "react";
import { useOkto } from "okto-sdk-react";
import { Menu, Divider, Typography, Table, Button, message, Modal } from 'antd';
import { WalletOutlined, SwapOutlined, OrderedListOutlined, LineChartOutlined, UserOutlined, SettingOutlined, LogoutOutlined, CopyOutlined } from '@ant-design/icons';
import './CryptoDashboard.scss';

import boyImage from './assets/boyImage.png';
import transaction from './assets/transaction.png';
import buyItem from './assets/buyItem.png';
import logoImage from './assets/okto.png';
import TransferTokensSection from "./views/TransferTokensSection";
import ProfileCard from "./views/ProfileCard";
import OrderStatus from "./views/OrderStatus";
import Portfolio from "./views/Portfolio";

const { Title, Text } = Typography;

const CryptoDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [transferResponse, setTransferResponse] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const [activeSection, setActiveSection] = useState('portfolio');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { getUserDetails, getPortfolio, createWallet, transferTokens, orderHistory } = useOkto();
  const [transferData, setTransferData] = useState({
    network_name: "",
    token_address: "",
    quantity: "",
    recipient_address: "",
  });
  const [orderData, setOrderData] = useState({
    order_id: "",
  });
  console.log("Portifolio Data",portfolioData);
  const fetchUserDetails = useCallback(async () => {
    try {
      const details = await getUserDetails();
      setUserDetails(details);
      setActiveSection('profile');
    } catch (error) {
      showErrorModal(`Failed to fetch user details: ${error.message}`);
    }
  }, [getUserDetails]);

  const fetchPortfolio = useCallback(async () => {
    try {
      const portfolio = await getPortfolio();
      setPortfolioData(portfolio);
    } catch (error) {
      showErrorModal(`Failed to fetch portfolio: ${error.message}`);
    }
  }, [getPortfolio]);

  const fetchWallets = useCallback(async () => {
    try {
      const walletsData = await createWallet();
      setWallets(walletsData);
    } catch (error) {
      showErrorModal(`Failed to fetch wallets: ${error.message}`);
    }
  }, [createWallet]);

  const handleTransferTokens = async () => {
    try {

      setTransferResponse(null);

      const response = await transferTokens(transferData);
      console.log('Transfer response:', response); 

      setTransferResponse(response);
      setActiveSection('transferResponse');

      const orderId = response?.orderId || 'N/A';

      Modal.success({
        title: 'Success',
        content: (
          <div>
            <p>Tokens transferred successfully! Order ID: {orderId}</p>
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(orderId);
                message.success('Order ID copied to clipboard!');
              }}
            >
              Copy Order ID
            </Button>
          </div>
        ),
      });
    } catch (error) {
      let errorMessage = 'Failed to transfer tokens';
      try {
        const errorDetails = JSON.parse(error.response.data.error.details);
        errorMessage = errorDetails.message;
      } catch (parseError) {
        console.error('Failed to parse error details:', parseError);
      }
      showErrorModal(errorMessage);
    }
  };



  const handleInputChange = (e) => {
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
  };

const handleOrderCheck = async (e) => {
  try {
    const response = await orderHistory(orderData);
    setOrderResponse(response); 
  } catch (error) {
    let errorMessage = 'Failed to fetch order status';
      try {
        const errorDetails = JSON.parse(error.response.data.error.details);
        errorMessage = errorDetails.message;
      } catch (parseError) {
        console.error('Failed to parse error details:', parseError);
      }
      showErrorModal(errorMessage);
    console.error('Failed to fetch order status:', error);
  }
};


  const handleInputChangeOrders = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const onMenuSelect = ({ key }) => {
    setActiveSection(key);
    switch (key) {
      case 'portfolio':
        fetchPortfolio();
        break;
      case 'wallets':
        fetchWallets();
        break;
      case 'profile':
        fetchUserDetails();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Address copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy address.');
    });
  };

  const walletColumns = [
    {
      title: 'Network Name',
      dataIndex: 'network_name',
      key: 'network_name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => (
        <>
          <Text>{text}</Text>
          <Button
            icon={<CopyOutlined />}
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => copyToClipboard(text)}
          />
        </>
      ),
    },
  ];

  const renderComponent = () => {
    switch (activeSection) {
      case 'portfolio':
        return (
          <Portfolio />
        );
      case 'wallets':
        return (
          <div>
            <Table
              columns={walletColumns}
              dataSource={wallets?.wallets || []}
              rowKey="address"
              pagination={false}
            />
          </div>
        );
      case 'transferTokens':
        return (
          <TransferTokensSection
            transferData={transferData}
            handleInputChange={handleInputChange}
            handleTransferTokens={handleTransferTokens}
            transferResponse={transferResponse}
          />
        );

      case 'orderStatus':
        return (
          <OrderStatus
            orderData={orderData}
            handleInputChangeOrders={handleInputChangeOrders}
            handleOrderCheck={handleOrderCheck}
            orderResponse={orderResponse}
          />
        );
      case 'profile':
        return <ProfileCard userDetails={userDetails} setActiveSection={setActiveSection} />;
      case 'settings':
        return (
          <div>
            <Title level={3}>Settings</Title>
            <p>Settings content goes here...</p>
          </div>
        );
      default:
        return null;
    }
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  const handleErrorModalClose = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <div className="crypto-dashboard-container" style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div
        className="left-fold"
        style={{ width: '15%', height: '100vh', backgroundColor: '#ffffff', boxShadow: '0px 1px 50px 0px #00000014' }}
      >
        <div className="logo" style={{ padding: '0px 0px', display: 'flex', alignItems: 'center' }}>
          <img src={logoImage} alt="Logo" style={{ width: '28%', height: 'auto', marginRight: '10px' }} />
          <h2 style={{ margin: 0, fontSize: '24px', color: '#01202B' }}>oktoCrypto</h2>
        </div>

        <Menu
          onClick={onMenuSelect}
          style={{
            width: `100%`,
            color: '#5F747D',
            fontSize: '16px',
            fontWeight: '600'
          }}
          selectedKeys={[activeSection]}
          mode="inline"
        >
          <Divider />
          <Menu.Item key="portfolio" icon={<LineChartOutlined />}>
            View Portfolio
          </Menu.Item>
          <Menu.Item key="wallets" icon={<WalletOutlined />}>
            View Wallets
          </Menu.Item>
          <Menu.Item key="transferTokens" icon={<SwapOutlined />}>
            Transfer Tokens
          </Menu.Item>
          <Menu.Item key="orderStatus" icon={<OrderedListOutlined />}>
            Check Order Status
          </Menu.Item>
          <Divider />
          <Menu.Item key="profile" icon={<UserOutlined />}>
            My Profile
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </div>
      <div
        className="right-fold"
        style={{ width: '70%', height: '100vh', overflow: 'auto', backgroundColor: "#161C2D", padding: '32px 48px' }}
      >
        {renderComponent()}
      </div>
      <div
        className="image-section"
        style={{ width: '15%', height: '100vh', backgroundColor: '#ffffff', boxShadow: '0px 1px 50px 0px #00000014', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px' }}
      >
        {/* This buyItem and transaction are future enhancements to be achieved */}
        <img src={buyItem} alt="buyItemImage" style={{ width: '100%', height: 'auto' }} />
        <img src={transaction} alt="transactionImage" style={{ width: '100%', height: 'auto' }} />
        <img src={boyImage} alt="boyImage" style={{ width: '100%', height: 'auto' }} />
      </div>
      <Modal
        title="Error"
        visible={isErrorModalVisible}
        onOk={handleErrorModalClose}
        onCancel={handleErrorModalClose}
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default CryptoDashboard;
