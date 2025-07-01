import React, { useState, useEffect } from 'react';
import { Typography, Badge, Popover, Select, Tag, Space, Empty } from 'antd';
import { GiftOutlined, InfoCircleOutlined, FrownOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const PromoMenu = ({ promotions, onGiftsChange }) => {
    const [selectedGifts, setSelectedGifts] = useState([]);

    const handleGiftSelect = (gift, promoId, selectorIndex) => {
        setSelectedGifts(prev => {
            const filtered = prev.filter(item =>
                !(item.promoId === promoId && item.selectorIndex === selectorIndex)
            );
            return gift ? [...filtered, { ...gift, promoId, selectorIndex }] : filtered;
        });
    };

    // Отправляем изменения в родительский компонент
    useEffect(() => {
        if (onGiftsChange) {
            const formattedGifts = formatSelectedGifts(selectedGifts, promotions);
            onGiftsChange(formattedGifts);
        }
    }, [selectedGifts, promotions, onGiftsChange]);

    // Форматирование выбранных подарков
    const formatSelectedGifts = (gifts, allPromotions) => {
        if (!gifts || !allPromotions) return [];

        const resultMap = {};

        gifts.forEach(gift => {
            if (!resultMap[gift.promoId]) {
                const promo = allPromotions.find(p => p.id === gift.promoId);
                if (!promo) return;

                resultMap[gift.promoId] = {
                    promo_id: gift.promoId,
                    total_count: promo.available,
                    used_count: 0,
                    items: []
                };
            }

            resultMap[gift.promoId].used_count++;
            resultMap[gift.promoId].items.push({
                id: gift.id,
                title: gift.title || gift.product_title,
                price: gift.price
            });
        });

        return Object.values(resultMap);
    };

    // Проверка на пустой список акций
    if (!promotions || promotions.length === 0) {
        return (
            <div style={{
                height: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
                textAlign: 'center'
            }}>
                <Empty
                    image={<FrownOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />}
                    description={
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            Акции, подходящие для данного заказа, не найдены
                        </Text>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Scrollable content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px'
            }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {promotions.map(promo => (
                        <div key={promo.id} style={{
                            marginBottom: '8px',
                            padding: '8px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px',
                            background: '#fff'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '6px',
                                alignItems: 'center'
                            }}>
                                <Text strong style={{ fontSize: '13px' }}>
                                    {promo.title}
                                    <Popover content={promo.info} title="Информация об акции">
                                        <InfoCircleOutlined style={{
                                            color: '#1890ff',
                                            marginLeft: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }} />
                                    </Popover>
                                </Text>
                                <Tag color="orange" style={{ margin: 0, fontSize: '12px', padding: '0 6px' }}>
                                    <GiftOutlined style={{ fontSize: '12px' }} /> {promo.available}
                                </Tag>
                            </div>

                            <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                {Array.from({ length: promo.available }).map((_, index) => {
                                    const selectedGift = selectedGifts.find(
                                        g => g.promoId === promo.id && g.selectorIndex === index
                                    );

                                    return (
                                        <Select
                                            key={index}
                                            style={{
                                                width: '100%',
                                                height: '32px',
                                                fontSize: '13px'
                                            }}
                                            placeholder={`Подарок ${index + 1}`}
                                            value={selectedGift?.id}
                                            onChange={value => {
                                                const gift = promo.items.find(item => item.id === value);
                                                handleGiftSelect(gift, promo.id, index);
                                            }}
                                            onClear={() => handleGiftSelect(null, promo.id, index)}
                                            allowClear
                                            dropdownMatchSelectWidth={false}
                                            dropdownStyle={{ minWidth: '250px', fontSize: '13px' }}
                                        >
                                            {promo.items.map(item => (
                                                <Option key={`${item.id}-${index}`} value={item.id}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}>
                                                        <span style={{
                                                            flex: 1,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {item.title}
                                                        </span>
                                                        <span style={{
                                                            color: '#52c41a',
                                                            fontWeight: '500',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {item.price} ₽
                                                        </span>
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    );
                                })}
                            </Space>
                        </div>
                    ))}
                </Space>
            </div>
        </div>
    );
};

export default PromoMenu;