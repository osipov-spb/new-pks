import React, { useState } from 'react';
import { Modal, Input, Table, Button, Spin, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import './PromoCodeModal.css';

const { Column } = Table;

const PromoCodeModal = ({ size = 'middle' }) => { // Добавляем пропс size
    const [visible, setVisible] = useState(false);
    const [promoCodes, setPromoCodes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };

    const addPromoCode = () => {
        if (inputValue) {
            setLoading(true);
            const newPromoCode = {
                key: Date.now(),
                certificate: inputValue,
                nominal: '0 руб.'
            };

            window.getNewPromoCodeData = () => {
                return newPromoCode;
            };

            setInputValue('');
        }
    };

    window.addPromoCodeToTable = (promoCode) => {
        setPromoCodes([...promoCodes, promoCode]);
        setLoading(false);
    };

    const deletePromoCode = (key) => {
        setPromoCodes(promoCodes.filter(item => item.key !== key));
    };

    window.getPromoCodes = () => {
        return promoCodes;
    };

    window.loadPromoCodes = (codes) => {
        setPromoCodes(codes);
    };

    return (
        <>
            {/* Обновлённая кнопка */}
            <Button
                size={size} // Используем переданный размер
                icon={<GiftOutlined />}
                onClick={showModal}
                style={{ marginRight: 0 }} // Убираем отступ справа
            >
                Промокод
            </Button>

            <Modal
                title="Ввод сертификатов"
                visible={visible}
                onOk={handleClose}
                onCancel={handleClose}
                footer={[
                    <Button key="back" onClick={handleClose} size={size}>
                        Закрыть
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleClose} size={size}>
                        Сохранить
                    </Button>,
                ]}
                width={600}
            >
                <Spin spinning={loading}>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="Введите промокод"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onPressEnter={addPromoCode}
                            disabled={loading}
                            size={size}
                        />
                        <Button
                            icon={<PlusOutlined />}
                            onClick={addPromoCode}
                            size={size}
                        />
                    </Space.Compact>
                </Spin>

                <Table
                    dataSource={promoCodes}
                    pagination={false}
                    style={{ marginTop: 16 }}
                    size={size}
                >
                    <Column title="Сертификат" dataIndex="certificate" key="certificate" />
                    <Column title="Номинал" dataIndex="nominal" key="nominal" />
                    <Column
                        title="Действие"
                        key="action"
                        render={(text, record) => (
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => deletePromoCode(record.key)}
                                size="small"
                                danger
                            />
                        )}
                    />
                </Table>
            </Modal>
        </>
    );
};

export default PromoCodeModal;