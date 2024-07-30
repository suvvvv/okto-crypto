import React, { useState, useEffect } from 'react';
import { useOkto } from 'okto-sdk-react';
import { Empty, Card} from 'antd';
import { DollarOutlined, WalletOutlined } from '@ant-design/icons';
import './Portfolio.scss';
import bitcoinImage from '../assets/btc.png'; 


const Portfolio = () => {
    const { getPortfolio } = useOkto();
    const [portfolio, setPortfolio] = useState([]);

    useEffect(() => {
        getPortfolio()
            .then((result) => {
                setPortfolio(result.tokens || []);
            })
            .catch((error) => {
                console.error(`Error fetching portfolio:`, error);
            });
    }, [getPortfolio]);

    return (
        <div className="portfolio-container">
            <div className="portfolio-list">
                {portfolio.length === 0 ? (
                    <div className="empty-state">
                        <Empty description="You have no tokens at the moment">
                            <img src={bitcoinImage} alt="Bitcoin" className="bitcoin-image" />
                        </Empty>
                    </div>
                ) : (
                    portfolio.map((item, index) => (
                        <Card key={index} className="portfolio-card">
                            <div className="portfolio-item">
                                <div className="token-info">
                                    <WalletOutlined className="token-icon" />
                                    <span className="token-name">{item.token_name}</span>
                                    <span className="quantity">{item.quantity}</span>
                                </div>
                                <span className="amount">
                                    <DollarOutlined className="amount-icon" />
                                    {item.amount_in_inr}
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Portfolio;
