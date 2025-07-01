import React from 'react';
import { Card, Typography, Collapse, Tag, Popover } from 'antd';
import { InfoCircleOutlined, GiftOutlined } from '@ant-design/icons';
import GiftSelector from './GiftSelector';

const { Panel } = Collapse;
const { Text, Title } = Typography;

const PromoItem = ({ promotion, onGiftSelect, selectedGifts }) => {
    return (
        <Card className="promo-card">
            <div className="promo-card-header">
                <Title level={5} style={{ margin: 0 }}>
                    {promotion.title}
                </Title>
                <Tag color="orange">
                    <GiftOutlined /> До {promotion.available} подарков
                </Tag>
            </div>

            <Collapse ghost>
                <Panel
                    header={
                        <Text type="secondary">
                            <InfoCircleOutlined /> Подробнее об акции
                        </Text>
                    }
                    key="1"
                >
                    <Text>{promotion.info}</Text>
                </Panel>
            </Collapse>

            <div className="promo-gift-selector">
                <GiftSelector
                    gifts={promotion.items}
                    maxSelections={promotion.available}
                    onSelect={onGiftSelect}
                    selectedGifts={selectedGifts}
                />
            </div>
        </Card>
    );
};

export default PromoItem;