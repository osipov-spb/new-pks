import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Table, Button, Spin, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import './PromoCodeModal.css';

const { Column } = Table;

const PromoCodeModal = ({ size = 'middle' }) => {
    const [visible, setVisible] = useState(false);
    const [promoCodes, setPromoCodes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const latestAddedCodeRef = useRef(null); // Реф для хранения последнего добавленного промокода

    // Регистрируем глобальные функции
    useEffect(() => {
        window.openPromoCodeModal = (jsonData) => {
            try {
                const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

                if (!Array.isArray(data)) {
                    throw new Error('Данные должны быть массивом');
                }

                const formattedData = data.map(item => ({
                    key: Date.now() + Math.random(),
                    certificate: item.certificate || '',
                    nominal: item.nominal ? `${item.nominal} руб.` : '0 руб.'
                }));

                setPromoCodes(formattedData);
                setVisible(true);
            } catch (error) {
                console.error('Ошибка обработки данных промокодов:', error);
                message.error('Неверный формат данных промокодов');
            }
        };

        window.closePromoCodeModal = () => {
            setVisible(false);
        };

        window.getCurrentPromoCodes = () => {
            return promoCodes.map(item => ({
                certificate: item.certificate,
                nominal: parseInt(item.nominal) || 0
            }));
        };

        window.getNewPromoCode = () => {
            return latestAddedCodeRef.current;
        };

        return () => {
            delete window.openPromoCodeModal;
            delete window.closePromoCodeModal;
            delete window.getCurrentPromoCodes;
            delete window.getNewPromoCode;
        };
    }, [promoCodes]);

    const addPromoCode = () => {
        if (inputValue) {
            setLoading(true);
            const newPromoCode = {
                key: Date.now(),
                certificate: inputValue,
                nominal: '0 руб.'
            };

            // Сохраняем последний добавленный промокод в реф
            latestAddedCodeRef.current = inputValue;

            setPromoCodes([...promoCodes, newPromoCode]);
            setInputValue('');
            setLoading(false);

            // Возвращаем промокод через callback (альтернативный вариант)
            if (window.onPromoCodeAdded) {
                window.onPromoCodeAdded(inputValue);
            }
        }
    };

    const deletePromoCode = (key) => {
        setPromoCodes(promoCodes.filter(item => item.key !== key));
    };

    return (
        <>
            <Button
                size={size}
                icon={<GiftOutlined />}
                href="#"
                data-button-id="promocodes-open"
                // onClick={() => message.info('Используйте window.openPromoCodeModal() для открытия')}
                style={{ marginRight: 0 }}
            >
                Промо
            </Button>

            <Modal
                title="Ввод сертификатов"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)} size={size}>
                        Закрыть
                    </Button>,
                ]}
                width={600}
                destroyOnClose
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
                            href="#"
                            data-button-id="promocode-add"
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
                    rowKey="key"
                >
                    <Column title="Сертификат" dataIndex="certificate" key="certificate" />
                    <Column title="Номинал" dataIndex="nominal" key="nominal" />
                    {/*<Column*/}
                    {/*    title="Действие"*/}
                    {/*    key="action"*/}
                    {/*    render={(_, record) => (*/}
                    {/*        <Button*/}
                    {/*            icon={<DeleteOutlined />}*/}
                    {/*            onClick={() => deletePromoCode(record.key)}*/}
                    {/*            size="small"*/}
                    {/*            danger*/}
                    {/*        />*/}
                    {/*    )}*/}
                    {/*/>*/}
                </Table>
            </Modal>
        </>
    );
};

export default PromoCodeModal;