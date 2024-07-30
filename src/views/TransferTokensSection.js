import React from 'react';
import { Typography } from 'antd';
import TransferTokensForm from './TransferTokensForm';
import './TransferTokensSection.scss';
import transferTokensBackground from '../assets/transferTokensBackground.png';
import Chat from '../assets/Chat.png';

const { Title, Text } = Typography;

const TransferTokensSection = ({ transferData, handleInputChange, handleTransferTokens, transferResponse }) => {
  return (
    <div className="transfer-tokens-section">
      <img src={transferTokensBackground} alt="Background" className="background-image" />
      <div className="overlay-content">
        <div className="text-content">
          <img src={Chat} alt="Message" className="overlay-image" />
          <Title level={2} style={{ color: 'white', fontWeight: 'bold' }}>Transfer Tokens Securely and Easily</Title>
          <Text style={{ color: 'white' }}>Use this form to transfer your tokens to another address quickly and securely. Just enter the required information and click "Transfer Tokens".</Text>
        </div>
        <div className="form-content">
          <TransferTokensForm
            transferData={transferData}
            handleInputChange={handleInputChange}
            handleTransferTokens={handleTransferTokens}
          />
          {transferResponse && (
            <div style={{ marginTop: '20px', color: 'black' }}>
              <Title level={4} style={{ color: 'black' }}>Transfer Response:</Title>
              <pre style={{ color: 'black' }}>{JSON.stringify(transferResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferTokensSection;
