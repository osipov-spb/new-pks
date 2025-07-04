import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Space } from 'antd';
import { CreditCardOutlined, WalletOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const PaymentForm = () => {
    const [total, setTotal] = useState(0);
    const [cashInput, setCashInput] = useState(0);
    const [change, setChange] = useState(0);
    const [paymentType, setPaymentType] = useState('cash');
    const [isOn, setIsOn] = useState(false);
    const [showPayLaterButton, setShowPayLaterButton] = useState(true);

    useEffect(() => {
        window.payment_form_open = (total, showPayLater = true) => {
            setTotal(total);
            setCashInput(0);
            setChange(0);
            setPaymentType('cash');
            setIsOn(true);
            setShowPayLaterButton(showPayLater);
        };

        window.payment_form_close = () => {
            setIsOn(false);
        };

        window.payment_confirm = () => {
            const returnData = {
                paymentType: paymentType,
                operationType: 'income'
            };
            setIsOn(false);
            return JSON.stringify(returnData);
        };
    }, [paymentType]);

    const handleCashButtonClick = () => setPaymentType('cash');
    const handleCardButtonClick = () => {
        setPaymentType('card');
        setCashInput(0);
        setChange(0);
    };
    const handleWithoutChangeClick = () => {
        setCashInput(total);
        setChange(0);
    };
    const handleInput = (amount) => {
        setCashInput(amount);
        setChange(amount - total);
    };

    const handleBackspaceClick = () => {
        const newCashInput = Math.floor(cashInput / 10);
        setCashInput(newCashInput);
        setChange(newCashInput - total);
    };

    const typeCashButton = paymentType === 'cash' ? 'primary' : '';
    const typeCardButton = paymentType === 'card' ? 'primary' : '';

    return (
        <>
            <Button
                href="#"
                data-button-id="payment"
                type="primary"
                icon={<ShoppingCartOutlined />}
                style={{
                    minWidth: '120px',
                    height: '35px',
                    // background: '#13c2c2',
                    // borderColor: '#13c2c2',
                    fontWeight: 500,
                    margin: '4px'
                }}
            >
                Оплатить
            </Button>


            <Modal
                title={null}
                closable={false}
                open={isOn}
                width={380}
                footer={null}
                bodyStyle={{ padding: 0 }}
            >
                <div style={{
                    backgroundColor: '#f0f2f5',
                    padding: '16px',
                    borderBottom: '1px solid #d9d9d9'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        padding: '12px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <span>Итого:</span>
                            <span style={{fontWeight: 'bold'}}>{total} ₽</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <span>Способ оплаты:</span>
                            <span style={{fontWeight: 'bold'}}>
                                {paymentType === 'cash' ? 'Наличные' : 'Карта'}
                            </span>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px'
                    }}>
                        <Button
                            type={paymentType === 'cash' ? 'primary' : 'default'}
                            icon={<WalletOutlined/>}
                            block
                            onClick={handleCashButtonClick}
                        >
                            Наличные
                        </Button>
                        <Button
                            type={paymentType === 'card' ? 'primary' : 'default'}
                            icon={<CreditCardOutlined/>}
                            block
                            onClick={handleCardButtonClick}
                        >
                            Карта
                        </Button>
                    </div>

                    {paymentType === 'cash' && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            padding: '12px',
                            marginBottom: '16px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '12px'
                            }}>
                                <span>Внесено:</span>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    {cashInput} ₽
                                </span>
                            </div>

                            <Button
                                type="dashed"
                                block
                                onClick={handleWithoutChangeClick}
                                style={{marginBottom: '12px'}}
                            >
                                Без сдачи
                            </Button>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                {[1, 2, 3, '←', 4, 5, 6, 'C', 7, 8, 9, '000', '.', 0, '00'].map(item => (
                                    <Button
                                        key={item}
                                        onClick={() => {
                                            if (item === '←') handleBackspaceClick();
                                            else if (item === 'C') handleInput(0);
                                            else handleInput(Number(`${cashInput}${item}`))
                                        }
                                        }
                                        style={{
                                            // height: '48px',
                                            margin: '2px',
                                            minWidth: 0
                                        }}
                                        type={typeof item === 'number' ? 'default' : 'primary'}
                                    >
                                        {item}
                                    </Button>
                                ))}
                                {/* Пустая ячейка вместо кнопки OK */}
                                <div></div>
                            </div>
                        </div>
                    )}

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        padding: '12px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <span>Сдача:</span>
                            <span style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: change >= 0 ? '#52c41a' : '#f5222d'
                            }}>
                                {change} ₽
                            </span>
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                        <Button
                            block
                            onClick={() => setIsOn(false)}
                            style={{
                                // height: '48px',
                                margin: '4px',
                                flex: '1 1 auto'
                            }}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="primary"
                            block
                            href="#"
                            data-button-id={!(paymentType === 'cash' && cashInput < total) ? "payment_confirm" : undefined}
                            onClick={() => {
                                const returnData = {paymentType, operationType: 'income'};
                                setIsOn(false);
                                return JSON.stringify(returnData);
                            }}
                            style={{
                                // height: '48px',
                                margin: '4px',
                                flex: '1 1 auto'
                            }}
                            disabled={paymentType === 'cash' && cashInput < total}
                        >
                            Подтвердить
                        </Button>
                    </div>

                    {showPayLaterButton && (
                        <Button
                            block
                            href="#"
                            data-button-id="prodeed_no_payment"
                            onClick={() => setIsOn(false)}
                            style={{
                                // height: '48px',
                                margin: '4px 4px 0'
                            }}
                        >
                            Оплатить позже
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default PaymentForm;