// noinspection JSUnresolvedReference

import React, {useEffect, useState} from 'react';
import {Alert, Button, Modal, Space, Card, Divider} from 'antd';
import {
    CarOutlined,
    CreditCardOutlined,
    PlusOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    WalletOutlined,
    QrcodeOutlined
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
    const [cardPaymentMethod, setCardPaymentMethod] = useState('card');
    const [isQrAvailable, setIsQrAvailable] = useState(false); // Новый параметр

    useEffect(() => {
        // Обработчик ввода с клавиатуры
        const handleKeyDown = (event) => {
            if (paymentType === 'cash' || paymentType === 'combined') {
                if (event.key >= '0' && event.key <= '9') {
                    // Добавляем цифру
                    handleInput(Number(cashInput.toString() + event.key));
                } else if (event.key === 'Backspace') {
                    // Стираем символ
                    handleBackspaceClick();
                } else if (event.key === 'Delete' || event.key === 'Escape') {
                    // Очищаем ввод
                    handleInput(0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

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
            setCardPaymentMethod('card');
            // Новый параметр - доступность QR оплаты
            setIsQrAvailable(parsedData.qrAvailable !== undefined ? parsedData.qrAvailable : false);
        };

        window.payment_form_close = () => {
            setIsOn(false);
            window.removeEventListener('keydown', handleKeyDown);
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
                proceed: proceed,
                qrSbp: paymentType === 'card' && cardPaymentMethod === 'qr'
            };
            setIsOn(false);
            window.removeEventListener('keydown', handleKeyDown);
            return JSON.stringify(returnData);
        };

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [paymentType, cashInput, cardInput, total, terminalType, proceed, cardPaymentMethod]);

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
        setCardPaymentMethod('card');
    };

    const handleCombinedButtonClick = () => {
        setPaymentType('combined');
        setCashInput(0);
        setCardInput(0);
        setChange(0);
        setShowCombinedWarning(false);
    };

    const handleCardMethodChange = (method) => {
        if (terminalType === 'courier' && method === 'qr') {
            return;
        }
        setCardPaymentMethod(method);
    };

    const handleTerminalTypeChange = (type) => {
        setTerminalType(type);
        if (type === 'courier' && cardPaymentMethod === 'qr') {
            setCardPaymentMethod('card');
        }
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

    const typeCashButton = paymentType === 'cash' ? 'primary' : 'default';
    const typeCardButton = paymentType === 'card' ? 'primary' : 'default';
    const typeCombinedButton = paymentType === 'combined' ? 'primary' : 'default';

    const getPaymentTypeText = () => {
        switch(paymentType) {
            case 'cash': return 'Наличные';
            case 'card': return cardPaymentMethod === 'qr' ? 'QR' : 'Карта';
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
                    height: '36px',
                    // fontWeight: 'bold',
                    margin: '4px',
                    borderRadius: '6px',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                style={{ top: 20 }}
            >
                <div style={{
                    backgroundColor: '#f0f2f5',
                    padding: '12px',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    {/* Header */}
                    <Card
                        size="small"
                        style={{ marginBottom: '12px', borderRadius: '6px' }}
                        bodyStyle={{ padding: '12px' }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>Итого:</span>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                                {total} ₽
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>Способ:</span>
                            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                {getPaymentTypeText()}
                            </span>
                        </div>
                    </Card>

                    {/* Payment Type Selection - В ОДНУ СТРОКУ с явными отступами */}
                    <div style={{
                        display: 'flex',
                        marginBottom: '12px'
                    }}>
                        <Button
                            type={typeCashButton}
                            icon={<WalletOutlined/>}
                            size="small"
                            onClick={handleCashButtonClick}
                            style={{
                                flex: 1,
                                height: '36px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '4px' // Явный отступ справа
                            }}
                        >
                            Наличные
                        </Button>
                        <Button
                            type={typeCardButton}
                            icon={<CreditCardOutlined/>}
                            size="small"
                            onClick={handleCardButtonClick}
                            style={{
                                flex: 1,
                                height: '36px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: '4px', // Явный отступ слева
                                marginRight: '4px' // Явный отступ справа
                            }}
                        >
                            Безнал
                        </Button>
                        <Button
                            type={typeCombinedButton}
                            icon={<PlusOutlined/>}
                            size="small"
                            onClick={handleCombinedButtonClick}
                            style={{
                                flex: 1,
                                height: '36px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: '4px' // Явный отступ слева
                            }}
                        >
                            Составная
                        </Button>
                    </div>

                    {/* Card Payment Details */}
                    {paymentType === 'card' && (
                        <Card
                            size="small"
                            style={{ marginBottom: '12px', borderRadius: '6px' }}
                            bodyStyle={{ padding: '12px' }}
                        >
                            {/* Payment Method Icon and Amount */}
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '12px',
                                padding: '8px',
                                backgroundColor: cardPaymentMethod === 'qr' ? '#f6ffed' : '#f0f8ff',
                                borderRadius: '4px',
                                border: `1px solid ${cardPaymentMethod === 'qr' ? '#b7eb8f' : '#91d5ff'}`
                            }}>
                                {cardPaymentMethod === 'qr' ? (
                                    <QrcodeOutlined style={{
                                        fontSize: '32px',
                                        color: '#52c41a',
                                        marginBottom: '6px'
                                    }} />
                                ) : (
                                    <CreditCardOutlined style={{
                                        fontSize: '32px',
                                        color: '#1890ff',
                                        marginBottom: '6px'
                                    }} />
                                )}
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: cardPaymentMethod === 'qr' ? '#389e0d' : '#1890ff'
                                }}>
                                    {cardPaymentMethod === 'qr' ? 'QR' : 'Карта'}
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    marginTop: '2px'
                                }}>
                                    {total} ₽
                                </div>
                            </div>

                            {/* Payment Method Selection - В ОДНУ СТРОКУ (только если QR доступен) */}
                            {isQrAvailable && (
                                <div style={{ marginBottom: hasCourierTerminal ? '12px' : '0' }}>
                                    <div style={{
                                        textAlign: 'center',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#666',
                                        marginBottom: '8px'
                                    }}>
                                        Способ оплаты:
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <Button
                                            type={cardPaymentMethod === 'card' ? 'primary' : 'default'}
                                            icon={<CreditCardOutlined />}
                                            size="small"
                                            onClick={() => handleCardMethodChange('card')}
                                            disabled={terminalType === 'courier' && cardPaymentMethod === 'qr'}
                                            style={{
                                                minWidth: '70px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '4px' // Явный отступ справа
                                            }}
                                        >
                                            Карта
                                        </Button>
                                        <Button
                                            type={cardPaymentMethod === 'qr' ? 'primary' : 'default'}
                                            icon={<QrcodeOutlined />}
                                            size="small"
                                            onClick={() => handleCardMethodChange('qr')}
                                            disabled={terminalType === 'courier'}
                                            style={{
                                                minWidth: '70px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '4px' // Явный отступ слева
                                            }}
                                        >
                                            QR
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Terminal Selection - В ОДНУ СТРОКУ */}
                            {hasCourierTerminal && (
                                <>
                                    <Divider style={{ margin: '12px 0', fontSize: '10px' }} />
                                    <div>
                                        <div style={{
                                            textAlign: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '##666',
                                            marginBottom: '8px'
                                        }}>
                                            Терминал:
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            <Button
                                                type={terminalType === 'stationary' ? 'primary' : 'default'}
                                                icon={<ShopOutlined />}
                                                size="small"
                                                onClick={() => handleTerminalTypeChange('stationary')}
                                                style={{
                                                    minWidth: '90px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    height: '28px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '4px' // Явный отступ справа
                                                }}
                                            >
                                                Стац.
                                            </Button>
                                            <Button
                                                type={terminalType === 'courier' ? 'primary' : 'default'}
                                                icon={<CarOutlined />}
                                                size="small"
                                                onClick={() => handleTerminalTypeChange('courier')}
                                                style={{
                                                    minWidth: '90px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    height: '28px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginLeft: '4px' // Явный отступ слева
                                                }}
                                            >
                                                Курьер.
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>
                    )}

                    {/* Cash and Combined Payment Input */}
                    {(paymentType === 'cash' || paymentType === 'combined') && (
                        <>
                            <Card
                                size="small"
                                style={{ marginBottom: '12px', borderRadius: '6px' }}
                                bodyStyle={{ padding: '12px' }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Наличные:</span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#1890ff'
                                    }}>
                                        {cashInput} ₽
                                    </span>
                                </div>

                                {paymentType === 'combined' && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '12px'
                                    }}>
                                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Карта:</span>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#52c41a'
                                        }}>
                                            {cardInput} ₽
                                        </span>
                                    </div>
                                )}

                                {paymentType === 'cash' && (
                                    <Button
                                        type="dashed"
                                        size="small"
                                        block
                                        onClick={handleWithoutChangeClick}
                                        style={{
                                            marginBottom: '12px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            height: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        Без сдачи
                                    </Button>
                                )}

                                {/* Compact Numeric Keypad с явными отступами */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    margin: '0 -2px' // Компенсируем внешние отступы
                                }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map(item => (
                                        <div key={item} style={{
                                            width: '33.33%',
                                            padding: '2px', // Явное расстояние между кнопками
                                            boxSizing: 'border-box'
                                        }}>
                                            <Button
                                                onClick={() => {
                                                    if (item === '←') handleBackspaceClick();
                                                    else if (item === 'C') handleInput(0);
                                                    else handleInput(Number(`${cashInput}${item}`))
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: '32px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                type={typeof item === 'number' ? 'default' : 'primary'}
                                            >
                                                {item}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Change Display */}
                            <Card
                                size="small"
                                style={{ marginBottom: '12px', borderRadius: '6px' }}
                                bodyStyle={{ padding: '12px' }}
                            >
                                {paymentType === 'cash' && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Сдача:</span>
                                        <span style={{
                                            fontSize: '14px',
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
                                            alignItems: 'center',
                                            marginBottom: '6px'
                                        }}>
                                            <span style={{ fontSize: '12px', fontWeight: 500 }}>Всего:</span>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: (cashInput + cardInput) >= total ? '#52c41a' : '#f5222d'
                                            }}>
                                                {cashInput + cardInput} ₽
                                            </span>
                                        </div>
                                        {cashInput > (total - cardInput) && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '11px', fontWeight: 500 }}>Сдача:</span>
                                                <span style={{
                                                    fontSize: '13px',
                                                    fontWeight: 'bold',
                                                    color: '#52c41a'
                                                }}>
                                                    {cashInput - (total - cardInput)} ₽
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Card>
                        </>
                    )}

                    {paymentType === 'combined' && showCombinedWarning && (
                        <Alert
                            message="Для полной оплаты наличными используйте 'Наличные'"
                            type="warning"
                            showIcon
                            style={{ marginBottom: '12px', borderRadius: '4px', fontSize: '11px' }}
                            size="small"
                        />
                    )}

                    {/* Action Buttons с явными отступами */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button
                            type="primary"
                            size="small"
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
                                        paymentType === 'combined' ? 'stationary' : null,
                                    qrSbp: paymentType === 'card' && cardPaymentMethod === 'qr'
                                };
                                setIsOn(false);
                                return JSON.stringify(returnData);
                            }}
                            style={{
                                height: '36px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px' // Явный отступ снизу
                            }}
                            disabled={!isPaymentValid()}
                        >
                            Подтвердить
                        </Button>

                        <Button
                            size="small"
                            block
                            onClick={() => setIsOn(false)}
                            style={{
                                height: '32px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px' // Явный отступ снизу
                            }}
                        >
                            Отмена
                        </Button>

                        {showPayLaterButton && (
                            <Button
                                size="small"
                                block
                                href="#"
                                data-button-id="prodeed_no_payment"
                                onClick={() => setIsOn(false)}
                                style={{
                                    height: '32px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                Оплатить позже
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PaymentForm;