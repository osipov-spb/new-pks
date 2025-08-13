// noinspection JSValidateTypes,JSUnresolvedReference

import React, {useEffect, useMemo, useState} from 'react';
import {Empty, Popover, Select, Space, Tag, Typography} from 'antd';
import {FrownOutlined, GiftOutlined, InfoCircleOutlined} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const PromoMenu = ({ promotions, onGiftsChange }) => {
    const [selectedGifts, setSelectedGifts] = useState([]);

    // Фильтруем акции, оставляя только те, у которых available > 0
    const availablePromotions = useMemo(() => {
        return promotions?.filter(promo => promo.available > 0) || [];
    }, [promotions]);

    // Получаем ID выбранных акций
    const selectedPromoIds = useMemo(() => {
        return [...new Set(selectedGifts.map(gift => gift.promoId))];
    }, [selectedGifts]);

    const handleGiftSelect = (gift, promoId, selectorIndex) => {
        setSelectedGifts(prev => {
            const filtered = prev.filter(item =>
                !(item.promoId === promoId && item.selectorIndex === selectorIndex)
            );
            return gift ? [...filtered, { ...gift, promoId, selectorIndex }] : filtered;
        });
    };

    // Проверка, должна ли акция быть заблокирована
    const isPromoDisabled = (promo) => {
        return selectedPromoIds.some(selectedId =>
            promo.incompatible?.includes(selectedId) ||
            (availablePromotions.find(p => p.id === selectedId)?.incompatible?.includes(promo.id)
            ));
    };

    // Проверка, должен ли конкретный подарок быть заблокирован
    const isGiftDisabled = (gift, promo) => {
        if (!selectedGifts.length) return false;
        return isPromoDisabled(promo);
    };

    // Отправляем изменения в родительский компонент
    useEffect(() => {
        if (onGiftsChange) {
            const formattedGifts = formatSelectedGifts(selectedGifts, availablePromotions);
            onGiftsChange(formattedGifts);
        }
    }, [selectedGifts, availablePromotions, onGiftsChange]);

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

    // Форматирование текста информации об акции
    const formatInfoContent = (info) => {
        return (
            <div style={{
                whiteSpace: 'pre-wrap',
                maxWidth: '400px',
                fontSize: '13px',
                lineHeight: '1.5'
            }}>
                {info}
            </div>
        );
    };

    // Проверка на пустой список акций
    if (!availablePromotions || availablePromotions.length === 0) {
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
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px'
            }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {availablePromotions.map(promo => {
                        const disabled = isPromoDisabled(promo);

                        return (
                            <div key={promo.id} style={{
                                marginBottom: '8px',
                                padding: '8px',
                                border: `1px solid ${disabled ? '#d9d9d9' : '#f0f0f0'}`,
                                borderRadius: '4px',
                                background: disabled ? '#f5f5f5' : '#fff',
                                opacity: disabled ? 0.6 : 1,
                                pointerEvents: disabled ? 'none' : 'auto'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '6px',
                                    alignItems: 'center'
                                }}>
                                    <Text strong style={{fontSize: '13px'}}>
                                        {promo.title}
                                        {disabled && (
                                            <Tag color="red" style={{marginLeft: '6px', fontSize: '11px'}}>
                                                Несовместимо
                                            </Tag>
                                        )}

                                    </Text>
                                    <div>
                                        <Popover
                                            content={formatInfoContent(promo.info)}
                                            title="Информация об акции"
                                            overlayStyle={{maxWidth: '450px'}}
                                        >
                                            <Tag
                                            // color={disabled ? 'default' : 'orange'}
                                            style={{margin: 0, fontSize: '12px', padding: '0 6px'}}
                                            >

                                                <InfoCircleOutlined style={{
                                                    color: '#1890ff',
                                                    marginRight: '6px',
                                                    marginLeft: '0px',
                                                    cursor: 'pointer',
                                                    fontSize: '15px'
                                                }}/>
                                                Условия
                                            </Tag>
                                        </Popover>
                                        <Tag
                                            color={disabled ? 'default' : 'orange'}
                                            style={{margin: 0, fontSize: '12px', padding: '0 6px', marginLeft: '6px'}}
                                        >
                                            <GiftOutlined style={{fontSize: '12px'}}/> {promo.available}
                                        </Tag>
                                    </div>
                                </div>

                                {!disabled && (
                                    <Space direction="vertical" size={6} style={{width: '100%'}}>
                                        {Array.from({length: promo.available}).map((_, index) => {
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
                                                    placeholder={`Выберите товар`}
                                                    value={selectedGift?.id}
                                                    onChange={value => {
                                                        const gift = promo.items.find(item => item.id === value);
                                                        handleGiftSelect(gift, promo.id, index);
                                                    }}
                                                    onClear={() => handleGiftSelect(null, promo.id, index)}
                                                    allowClear
                                                    dropdownMatchSelectWidth={false}
                                                >
                                                    {promo.items.map(item => (
                                                        <Option
                                                            key={`${item.id}-${index}`}
                                                            value={item.id}
                                                            disabled={isGiftDisabled(item, promo)}
                                                        >
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
                                )}
                            </div>
                        );
                    })}
                </Space>
            </div>
        </div>
    );
};

export default PromoMenu;