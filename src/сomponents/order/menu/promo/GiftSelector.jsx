import React, { useState } from 'react';
import { Select, Space, Alert } from 'antd';
import { GiftOutlined } from '@ant-design/icons';

const { Option } = Select;

const GiftSelector = ({ gifts, maxSelections, onSelect, selectedGifts }) => {
    const [selections, setSelections] = useState([]);

    const handleChange = (value, index) => {
        const newSelections = [...selections];
        const selectedGift = gifts.find(gift => gift.id === value);

        if (selectedGift) {
            newSelections[index] = selectedGift;
            setSelections(newSelections.filter(Boolean));
            onSelect(selectedGift, true);
        }
    };

    const isGiftSelected = giftId =>
        selectedGifts.some(gift => gift.id === giftId) ||
        selections.some(gift => gift?.id === giftId);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {maxSelections > 1 && (
                <Alert
                    message={`Вы можете выбрать до ${maxSelections} подарков`}
                    type="info"
                    showIcon
                />
            )}

            {Array.from({ length: maxSelections }).map((_, index) => (
                <Select
                    key={index}
                    style={{ width: '100%' }}
                    placeholder={`Выберите подарок ${index + 1}`}
                    optionLabelProp="label"
                    onChange={value => handleChange(value, index)}
                    value={selections[index]?.id}
                    suffixIcon={<GiftOutlined />}
                >
                    {gifts.map(gift => (
                        <Option
                            key={gift.id}
                            value={gift.id}
                            label={gift.title}
                            disabled={isGiftSelected(gift.id) && !selections[index]?.id === gift.id}
                        >
                            <div className="gift-option">
                                <span>{gift.title}</span>
                                <span className="gift-price">{gift.price} ₽</span>
                            </div>
                        </Option>
                    ))}
                </Select>
            ))}
        </Space>
    );
};

export default GiftSelector;