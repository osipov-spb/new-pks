import React, { useState, useEffect } from 'react';
import { Col, Layout, Row, Space, Input, Button, Modal } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/c/font_4783646_mhk8odqws27.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
    ],
});

const { Content, Footer } = Layout;
const { TextArea } = Input;

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
        const newCashInput = Math.floor(cashInput / 10); // Удаляем последний символ
        setCashInput(newCashInput);
        setChange(newCashInput - total);
    };

    const typeCashButton = paymentType === 'cash' ? 'primary' : '';
    const typeCardButton = paymentType === 'card' ? 'primary' : '';

    return (
        <>
            <Button href="#" data-button-id="payment" type="primary"
                    style={{
                        minWidth: '120px',
                        minHeight: '40px'

                    }}
            >
                {/*onClick={() => setIsOn(!isOn)}*/}
                Оплатить
            </Button>
            <Modal
                title="Оплата"
                open={isOn}
                width={350}
                okText={<a data-button-id='payment_confirm'>Оплатить</a>}
                cancelText={<a data-button-id='payment_cancel'>Закрыть</a>}
            >
                <div className="payment-summary">
                    <Row>
                        <Col span={11}>
                            <div style={{ textAlign: 'left' }}>Итого к оплате:</div>
                        </Col>
                        <Col span={13}>
                            <div style={{ textAlign: 'right' }}>{total} ₽</div>
                        </Col>
                    </Row>
                </div>

                <div className="payment-btn-wrapper">
                    <Space size={[10, 10]} wrap>
                        <Button type={typeCashButton} className='payment-form-number-btn-xl' onClick={handleCashButtonClick}>
                            <IconFont type="icon-cash"/>
                        </Button>
                        <Button type={typeCardButton} className='payment-form-number-btn-xl' onClick={handleCardButtonClick}>
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

                    <Row gutter={5}> {/* Уменьшили расстояние между группами */}
                        {/*<Space direction="horizontal" size={0}>*/}
                        <Col span={13}>
                            <Space size={[10, 10]} wrap>
                                {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '00'].map((num) => (
                                    <Button key={num} className='payment-form-number-btn-s' onClick={() => handleInput(Number(`${cashInput}${num}`))}>
                                        {num}
                                    </Button>
                                ))}
                            </Space>
                        </Col>
                        <Col span={7}>
                            <Space direction="vertical" size={10} >
                                {[1000, 2000, 5000].map((amount) => (
                                    <Button key={amount} type="primary" className='payment-form-number-btn-l' onClick={() => handleInput(amount)}>
                                        {amount} ₽
                                    </Button>
                                ))}
                                <Button className='payment-form-number-btn-l' onClick={handleBackspaceClick}>
                                    <IconFont type="icon-backspace"/>
                                </Button>
                            </Space>
                        </Col>
                        {/*</Space>*/}
                    </Row>
                </div>
                <br/>
                <div className="payment-summary">
                    <Row>
                        <Col span={11}>
                            <div style={{ textAlign: 'left' }}>Сдача:</div>
                        </Col>
                        <Col span={13}>
                            <div style={{ textAlign: 'right' }}>{change} ₽</div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};

export default PaymentForm;