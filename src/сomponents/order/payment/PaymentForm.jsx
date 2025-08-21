// noinspection JSUnresolvedReference

import React, {useEffect, useState} from 'react';
import {Alert, Button, Modal, Space} from 'antd';
import {
    CarOutlined,
    CreditCardOutlined,
    PlusOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    WalletOutlined
} from '@ant-design/icons';

const PaymentForm = () => {
    const [total, setTotal] = useState(0);
    const [cashInput, setCashInput] = useState(0);
    const [cardInput, setCardInput] = useState(0);
    const [change, setChange] = useState(0);
    const [proceed, setProceed] = useState(false);
    const [paymentType, setPaymentType] = useState('cash');
    const [terminalType, setTerminalType] = useState('stationary');
    const [hasCourierTerminal, setHasCourierTerminal] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [showPayLaterButton, setShowPayLaterButton] = useState(true);
    const [showCombinedWarning, setShowCombinedWarning] = useState(false);

    useEffect(() => {
        window.payment_form_open = (data) => {
            let parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            setTotal(parsedData.total);
            setCashInput(0);
            setCardInput(0);
            setChange(0);
            setProceed(parsedData.proceed);
            setPaymentType(parsedData.paymentType);
            setTerminalType(parsedData.terminalType);
            setHasCourierTerminal(parsedData.courierTerminalAvailable);
            setIsOn(true);
            setShowPayLaterButton(parsedData.showPayLater);
            setShowCombinedWarning(false);
        };

        window.payment_form_close = () => {
            setIsOn(false);
        };

        window.payment_confirm = () => {
            const returnData = {
                paymentType: paymentType,
                operationType: 'income',
                cashAmount: paymentType === 'cash' ? Math.min(cashInput, total) :
                    paymentType === 'combined' ? Math.min(cashInput, total - cardInput) : 0,
                cardAmount: paymentType === 'card' ? total : paymentType === 'combined' ? cardInput : 0,
                change: paymentType === 'cash' ? Math.max(0, cashInput - total) :
                    paymentType === 'combined' ? Math.max(0, cashInput - (total - cardInput)) : 0,
                terminalType: paymentType === 'card' ? terminalType :
                    paymentType === 'combined' ? 'stationary' : null,
                proceed: proceed
            };
            setIsOn(false);
            return JSON.stringify(returnData);
        };
    }, [paymentType, cashInput, cardInput, total, terminalType]);

    const handleCashButtonClick = () => {
        setPaymentType('cash');
        setCardInput(0);
        setShowCombinedWarning(false);
    };

    const handleCardButtonClick = () => {
        setPaymentType('card');
        setCashInput(0);
        setChange(0);
        setCardInput(total);
        setShowCombinedWarning(false);
    };

    const handleCombinedButtonClick = () => {
        setPaymentType('combined');
        setCashInput(0);
        setCardInput(0);
        setChange(0);
        setShowCombinedWarning(false);
    };

    const handleWithoutChangeClick = () => {
        if (paymentType === 'cash') {
            setCashInput(total);
            setChange(0);
        }
    };

    const handleInput = (amount) => {
        if (paymentType === 'cash') {
            setCashInput(amount);
            setChange(amount - total);
        } else if (paymentType === 'combined') {
            const newCashInput = amount;
            const newCardInput = Math.max(0, total - newCashInput);

            setCashInput(newCashInput);
            setCardInput(newCardInput);
            setChange(Math.max(0, newCashInput - (total - newCardInput)));

            setShowCombinedWarning(newCashInput >= total);
        }
    };

    const handleBackspaceClick = () => {
        if (paymentType === 'cash' || paymentType === 'combined') {
            const newCashInput = Math.floor(cashInput / 10);
            setCashInput(newCashInput);

            if (paymentType === 'cash') {
                setChange(newCashInput - total);
            } else {
                const newCardInput = Math.max(0, total - newCashInput);
                setCardInput(newCardInput);
                setChange(Math.max(0, newCashInput - (total - newCardInput)));
                setShowCombinedWarning(newCashInput >= total);
            }
        }
    };

    const typeCashButton = paymentType === 'cash' ? 'primary' : '';
    const typeCardButton = paymentType === 'card' ? 'primary' : '';
    const typeCombinedButton = paymentType === 'combined' ? 'primary' : '';

    const getPaymentTypeText = () => {
        switch(paymentType) {
            case 'cash': return 'Наличные';
            case 'card': return 'Карта';
            case 'combined': return 'Составная';
            default: return '';
        }
    };

    const isPaymentValid = () => {
        if (paymentType === 'cash') return cashInput >= total;
        if (paymentType === 'card') return true;
        if (paymentType === 'combined') {
            return (cashInput + cardInput) >= total && !showCombinedWarning;
        }
        return false;
    };

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
                    fontWeight: 500,
                    margin: '4px',
                    borderRadius: '6px'
                }}
            >
                Оплатить
            </Button>

            <Modal
                title={null}
                closable={false}
                open={isOn}
                width={420}
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
                                {getPaymentTypeText()}
                            </span>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px'
                    }}>
                        <Button
                            type={typeCashButton}
                            icon={<WalletOutlined/>}
                            block
                            onClick={handleCashButtonClick}
                        >
                            Наличные
                        </Button>
                        <Button
                            type={typeCardButton}
                            icon={<CreditCardOutlined/>}
                            block
                            onClick={handleCardButtonClick}
                        >
                            Карта
                        </Button>
                        <Button
                            type={typeCombinedButton}
                            icon={<PlusOutlined/>}
                            block
                            onClick={handleCombinedButtonClick}
                        >
                            Составная
                        </Button>
                    </div>

                    {paymentType === 'card' && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            padding: '12px',
                            marginBottom: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ marginBottom: '16px' }}>
                                <CreditCardOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Оплата по карте: {total} ₽
                            </div>

                            {hasCourierTerminal && (
                                <div style={{ margin: '13px 0', borderTop: '1px solid #f0f0f0' }}>
                                    <div style={{
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px',
                                        marginTop: '13px'
                                        }}>
                                        Терминал:
                                    </div>
                                    <Space>
                                        <Button
                                            type={terminalType === 'stationary' ? 'primary' : 'default'}
                                            onClick={() => setTerminalType('stationary')}
                                            icon={<ShopOutlined />}
                                        >
                                            Стационарный
                                        </Button>
                                        <Button
                                            type={terminalType === 'courier' ? 'primary' : 'default'}
                                            onClick={() => setTerminalType('courier')}
                                            icon={<CarOutlined />}
                                        >
                                            Курьерский
                                        </Button>
                                    </Space>
                                </div>
                            )}
                        </div>
                    )}

                    {(paymentType === 'cash' || paymentType === 'combined') && (
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
                                <span>Внесено наличными:</span>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    {cashInput} ₽
                                </span>
                            </div>

                            {paymentType === 'combined' && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px'
                                }}>
                                    <span>Оплата картой:</span>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold'
                                    }}>
                                        {cardInput} ₽
                                    </span>
                                </div>
                            )}

                            {paymentType === 'cash' && (
                                <Button
                                    type="dashed"
                                    block
                                    onClick={handleWithoutChangeClick}
                                    style={{marginBottom: '12px'}}
                                >
                                    Без сдачи
                                </Button>
                            )}

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
                                        }}
                                        style={{
                                            margin: '2px',
                                            minWidth: 0
                                        }}
                                        type={typeof item === 'number' ? 'default' : 'primary'}
                                    >
                                        {item}
                                    </Button>
                                ))}
                                <div></div>
                            </div>
                        </div>
                    )}

                    {(paymentType === 'cash' || paymentType === 'combined') && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            padding: '12px',
                            marginBottom: '16px'
                        }}>
                            {paymentType === 'cash' && (
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
                                        {Math.max(0, change)} ₽
                                    </span>
                                </div>
                            )}
                            {paymentType === 'combined' && (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <span>Итого внесено:</span>
                                        <span style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: (cashInput + cardInput) >= total ? '#52c41a' : '#f5222d'
                                        }}>
                                            {cashInput + cardInput} ₽
                                        </span>
                                    </div>
                                    {cashInput > (total - cardInput) && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>Сдача с наличных:</span>
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#52c41a'
                                            }}>
                                                {cashInput - (total - cardInput)} ₽
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {paymentType === 'combined' && showCombinedWarning && (
                        <Alert
                            message="Если вносите всю сумму наличными, используйте способ оплаты 'Наличные'"
                            type="warning"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />
                    )}

                    <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                        <Button
                            block
                            onClick={() => setIsOn(false)}
                            style={{
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
                            data-button-id={isPaymentValid() ? "payment_confirm" : undefined}
                            onClick={() => {
                                const returnData = {
                                    paymentType,
                                    operationType: 'income',
                                    cashAmount: paymentType === 'cash' ? cashInput : paymentType === 'combined' ? cashInput : 0,
                                    cardAmount: paymentType === 'card' ? total : paymentType === 'combined' ? cardInput : 0,
                                    change: paymentType === 'cash' ? Math.max(0, cashInput - total) :
                                        paymentType === 'combined' ? Math.max(0, cashInput - (total - cardInput)) : 0,
                                    terminalType: paymentType === 'card' ? terminalType :
                                        paymentType === 'combined' ? 'stationary' : null
                                };
                                setIsOn(false);
                                return JSON.stringify(returnData);
                            }}
                            style={{
                                margin: '4px',
                                flex: '1 1 auto'
                            }}
                            disabled={!isPaymentValid()}
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