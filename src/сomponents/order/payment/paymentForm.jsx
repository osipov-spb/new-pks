import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Space } from 'antd';
import { CreditCardOutlined, WalletOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const PaymentForm = () => {
    const [total, setTotal] = useState(0);
    const [cashInput, setCashInput] = useState(0);
    const [change, setChange] = useState(0);
    const [paymentType, setPaymentType] = useState('cash');
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        window.payment_form_open = (total) => {
            setTotal(total);
            setCashInput(0);
            setChange(0);
            setPaymentType('cash');
            setIsOn(true);
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
                    minHeight: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
            >
                Оплатить
            </Button>

            <Modal
                title={null}
                closable={false}
                open={isOn}
                width={350}
                footer={[
                    <Button key="cancel" onClick={() => setIsOn(false)}>Закрыть</Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                            const returnData = {paymentType, operationType: 'income'};
                            setIsOn(false);
                            return JSON.stringify(returnData);
                        }}
                    >
                        Оплатить
                    </Button>
                ]}
            >
                {/* Остальное содержимое модального окна остается без изменений */}
                <div className="payment-summary">
                    <Row>
                        <Col span={11}>
                            <div style={{textAlign: 'left'}}>Итого к оплате:</div>
                        </Col>
                        <Col span={13}>
                            <div style={{textAlign: 'right'}}>{total} ₽</div>
                        </Col>
                    </Row>
                </div>

                <div className="payment-btn-wrapper">
                    <Space size={[10, 10]} wrap>
                        <Button type={typeCashButton} className='payment-form-number-btn-xl'
                                onClick={handleCashButtonClick}>
                            <WalletOutlined/>
                        </Button>
                        <Button type={typeCardButton} className='payment-form-number-btn-xl'
                                onClick={handleCardButtonClick}>
                            <CreditCardOutlined/>
                        </Button>
                    </Space>
                    <br/><br/><br/><br/>

                    <div className='payment-cash-data'>
                        <Row>
                            <Col span={5}>
                                <div>Наличные:</div>
                            </Col>
                            <Col span={7}>
                                <Button className='payment-cash-no-change-button' onClick={handleWithoutChangeClick}>
                                    Без сдачи
                                </Button>
                            </Col>
                            <Col span={10}>
                                <div className='payment-cash-summary'>{cashInput} ₽</div>
                            </Col>
                        </Row>
                    </div>

                    <Row gutter={5}>
                        <Col span={13}>
                            <Space size={[10, 10]} wrap>
                                {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '00'].map((num) => (
                                    <Button key={num} className='payment-form-number-btn-s'
                                            onClick={() => handleInput(Number(`${cashInput}${num}`))}>
                                        {num}
                                    </Button>
                                ))}
                            </Space>
                        </Col>
                        <Col span={7}>
                            <Space direction="vertical" size={10}>
                                {[1000, 2000, 5000].map((amount) => (
                                    <Button key={amount} type="primary" className='payment-form-number-btn-l'
                                            onClick={() => handleInput(amount)}>
                                        {amount} ₽
                                    </Button>
                                ))}
                                <Button className='payment-form-number-btn-l' onClick={handleBackspaceClick}>
                                    <DeleteOutlined/>
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>
                <br/>
                <div className="payment-summary">
                    <Row>
                        <Col span={11}>
                            <div style={{textAlign: 'left'}}>Сдача:</div>
                        </Col>
                        <Col span={13}>
                            <div style={{textAlign: 'right'}}>{change} ₽</div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};

export default PaymentForm;