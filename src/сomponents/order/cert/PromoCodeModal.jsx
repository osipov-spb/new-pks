import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, Modal, Space, Spin, Table} from 'antd';
import {GiftOutlined, PlusOutlined} from '@ant-design/icons';

const { Column } = Table;

const PromoCodeModal = ({ size = 'middle' }) => {
    const [open, setOpen] = useState(false);
    const [promoCodes, setPromoCodes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const latestAddedCodeRef = useRef(null); // Реф для хранения последнего добавленного промокода

    // Регистрируем глобальные функции
    useEffect(() => {
        window.openPromoCodeModal = (jsonData) => {
            try {
                const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

                const formattedData = data.map(item => ({
                    key: Date.now() + Math.random(),
                    certificate: item.certificate || '',
                    nominal: item.nominal ? `${item.nominal} руб.` : '0 руб.'
                }));

                setPromoCodes(formattedData);
                setOpen(true);
            } catch (error) {
                console.error('Ошибка обработки данных промокодов:', error);
            }
        };

        window.closePromoCodeModal = () => {
            setOpen(false);
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
        }
    };

    return (
        <>
            <Button
                size={size}
                icon={<GiftOutlined style={{color: '#1890ff'}}/>}
                href="#"
                data-button-id="promocodes-open"
                // onClick={() => message.info('Используйте window.openPromoCodeModal() для открытия')}
                style={{
                    marginRight: 0,
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9'
                }}
            >
                Промо
            </Button>

            <Modal
                title="Ввод сертификатов"
                open={open}  // Changed from visible
                onCancel={() => setOpen(false)}  // Changed from setVisible
                footer={[
                    <Button key="back" onClick={() => setOpen(false)} size={size}>
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
                </Table>
            </Modal>
        </>
    );
};

export default PromoCodeModal;