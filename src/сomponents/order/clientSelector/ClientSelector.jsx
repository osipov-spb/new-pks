// noinspection JSValidateTypes,JSCheckFunctionSignatures,JSUnresolvedReference

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Tabs, Tag} from 'antd';
import {
    DeleteOutlined,
    IdcardOutlined,
    MailOutlined,
    ManOutlined,
    PercentageOutlined,
    PhoneOutlined,
    UserOutlined,
    WomanOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const { Option } = Select;
const { TabPane } = Tabs;

const NumberInputPadModal = ({ clientData, onClientChange }) => {
    const [inputValue, setInputValue] = useState(clientData?.phone || '+7');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [setShowAdditionalFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNumberPad, setShowNumberPad] = useState(true);
    const [isNewClient, setIsNewClient] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const [isFormInitiallyValid, setIsFormInitiallyValid] = useState(false);
    const [activeSearchMode, setActiveSearchMode] = useState('phone');
    const [showTabs, setShowTabs] = useState(true);

    const numberPadLayout = useMemo(() => {
        return [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [
                activeSearchMode === 'phone' ? '+' : '+',
                '0',
                <DeleteOutlined key="delete" />
            ]
        ];
    }, [activeSearchMode]);

    const handleInputChange = useCallback((e) => {
        if (activeSearchMode === 'phone') {
            // Для телефона разрешаем только цифры и +
            setInputValue(e.target.value.replace(/[^0-9+]/g, ''));
        } else {
            // Для карты разрешаем любые символы
            setInputValue(e.target.value);
        }
    }, [activeSearchMode]);

    const handleNumberClick = useCallback((value) => {
        setInputValue(prev => {
            if (activeSearchMode === 'phone') {
                return prev.length < 16 ? prev + value : prev;
            }
            return prev.length < 20 ? prev + value : prev;
        });
    }, [activeSearchMode]);

    const handleDeleteClick = useCallback(() => {
        setInputValue(prev => prev.length > (activeSearchMode === 'phone' ? 2 : 0) ? prev.slice(0, -1) : prev);
    }, [activeSearchMode]);

    const handlePhoneFocus = useCallback(() => {
        setShowNumberPad(true);
        setShowAdditionalFields(false);
    }, []);

    const handleConfirmInput = useCallback(() => {
        if (
            (activeSearchMode === 'phone' && inputValue.length >= 11) ||
            (activeSearchMode === 'card' && inputValue.length >= 4)
        ) {
            setIsLoading(true);
            setShowNumberPad(false);
        }
    }, [inputValue, activeSearchMode]);

    const onFinish = useCallback(async (values) => {
        setIsLoading(true);
        try {
            const clientData = {
                ...values,
                phone: activeSearchMode === 'phone' ? inputValue : undefined,
                cardNumber: activeSearchMode === 'card' ? inputValue : undefined,
                birthDate: values.birthDate ? values.birthDate.toISOString() : null,
                searchMode: activeSearchMode
            };
            if (onClientChange) {
                await onClientChange(clientData);
            }
            setIsModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, onClientChange, activeSearchMode]);

    const onValuesChange = useCallback((changedValues, allValues) => {
        setFormValues(allValues);
    }, []);

    const isFormValid = useMemo(() => {
        return (
            ((activeSearchMode === 'phone' && inputValue.length >= 11) ||
                (activeSearchMode === 'card' && inputValue.length >= 4)) &&
            formValues.name &&
            formValues.gender
        );
    }, [inputValue, formValues, activeSearchMode]);

    useEffect(() => {
        window.clientSelectorFillFormData = (data) => {
            setIsLoading(true);
            setShowTabs(false);
            let parsedData;
            try {
                parsedData = typeof data === 'string' ? JSON.parse(data) : data;

                setInitialFormData(parsedData);
                setIsNewClient(!!parsedData.newClient);

                const formData = {
                    name: parsedData.name || '',
                    discount: parsedData.discount || '',
                    gender: parsedData.gender || '',
                    advertising: parsedData.advertising || '',
                    birthDate: parsedData.birthDate ? moment(parsedData.birthDate) : null,
                    email: parsedData.email || '',
                };

                const initiallyValid = (
                    (parsedData.phone?.length >= 11 || parsedData.cardNumber?.length >= 4) &&
                    parsedData.name &&
                    parsedData.gender
                );

                setIsFormInitiallyValid(initiallyValid);
                setFormValues(formData);

                setActiveSearchMode('phone');
                if (parsedData.phone) {
                    setInputValue(parsedData.phone);
                    const newData = { phone: parsedData.phone, searchMode: 'phone' };
                    if (onClientChange) {
                        onClientChange(newData);
                    }
                } else {
                    setInputValue('+7');
                }

                form.setFieldsValue(formData);

                if ((parsedData.phone?.length >= 11) || (parsedData.cardNumber?.length >= 4)) {
                    setShowAdditionalFields(true);
                    setShowNumberPad(false);
                }
            } catch (e) {
                console.error('Error parsing form data:', e);
            } finally {
                setIsLoading(false);
            }
        };

        window.clientSelectorSetPhone = (phone) => {
            setInputValue(phone);
            setActiveSearchMode('phone');
            if (phone && phone.length >= 11) {
                setShowAdditionalFields(true);
                setShowNumberPad(false);
                const newData = { phone, searchMode: 'phone' };
                if (onClientChange) {
                    onClientChange(newData);
                }
            }
        };

        window.clientSelectorSaveAndGetFormData = () => {
            const values = form.getFieldsValue();
            const currentData = {
                ...values,
                phone: activeSearchMode === 'phone' ? inputValue : undefined,
                cardNumber: activeSearchMode === 'card' ? inputValue : undefined,
                birthDate: values.birthDate ? values.birthDate.toISOString() : null,
                searchMode: activeSearchMode
            };

            let action;
            if (isNewClient) {
                action = 'created';
            } else {
                const isEdited = initialFormData && Object.keys(currentData).some(
                    key => JSON.stringify(currentData[key]) !== JSON.stringify(initialFormData[key])
                );
                action = isEdited ? 'edited' : 'saved';
            }

            return JSON.stringify({
                ...currentData,
                action: action
            });
        };

        window.clientSelectorCloseForm = () => {
            setIsModalOpen(false);
        };

        return () => {
            delete window.clientSelectorFillFormData;
            delete window.clientSelectorSetPhone;
            delete window.clientSelectorSaveAndGetFormData;
            delete window.clientSelectorCloseForm;
        };
    }, [form, inputValue, onClientChange, isNewClient, initialFormData, activeSearchMode]);

    const handleTabChange = (key) => {
        setActiveSearchMode(key);
        setInputValue(key === 'phone' ? '+7' : '');
    };

    return (
        <>
            <Button
                onClick={() => {
                    setIsModalOpen(true);
                    setShowAdditionalFields(false);
                    setShowNumberPad(true);
                    setActiveSearchMode('phone');
                    setInputValue('+7');
                    setShowTabs(true);
                }}
                icon={<UserOutlined />}
                style={{
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9'
                }}
            >
                {clientData?.phone || 'Гость'}
            </Button>

            <Modal
                title="Данные клиента"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setShowAdditionalFields(false);
                    setShowNumberPad(true);
                    setActiveSearchMode('phone');
                    setInputValue('+7');
                }}
                footer={null}
                width={500}
                destroyOnClose
                bodyStyle={{ paddingTop: 0 }}
            >
                <Spin spinning={isLoading} tip="Загрузка данных...">
                    <div style={{ marginBottom: 16 }}>
                        {showTabs && (
                            <Tabs activeKey={activeSearchMode} onChange={handleTabChange}>
                                <TabPane tab={<span><PhoneOutlined />Телефон</span>} key="phone" />
                                <TabPane tab={<span><IdcardOutlined />Карта</span>} key="card" />
                            </Tabs>
                        )}
                        <Input
                            value={inputValue}
                            onChange={handleInputChange}  // Используем новый обработчик
                            onFocus={handlePhoneFocus}
                            prefix={activeSearchMode === 'phone' ? <PhoneOutlined /> : <IdcardOutlined />}
                            placeholder={activeSearchMode === 'phone' ? '+7 (___) ___-__-__' : 'Номер карты'}
                            disabled={isLoading}
                        />
                    </div>

                    {showNumberPad ? (
                        <>
                            <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                                {numberPadLayout.map((row, rowIndex) => (
                                    <React.Fragment key={`row-${rowIndex}`}>
                                        {row.map((item, colIndex) => (
                                            <Col span={8} key={`col-${rowIndex}-${colIndex}`}>
                                                <Button
                                                    block
                                                    onClick={() => {
                                                        if (React.isValidElement(item)) {
                                                            handleDeleteClick();
                                                        } else {
                                                            handleNumberClick(item);
                                                        }
                                                    }}
                                                    style={{ height: 48, fontSize: 18 }}
                                                    icon={React.isValidElement(item) ? item : null}
                                                >
                                                    {!React.isValidElement(item) && item}
                                                </Button>
                                            </Col>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Row>
                            <Button
                                type="primary"
                                onClick={handleConfirmInput}
                                block
                                disabled={
                                    (activeSearchMode === 'phone' && inputValue.length < 11) ||
                                    (activeSearchMode === 'card' && inputValue.length < 4) ||
                                    isLoading
                                }
                                href="#"
                                data-button-id={
                                    !(
                                        (activeSearchMode === 'phone' && inputValue.length < 11) ||
                                        (activeSearchMode === 'card' && inputValue.length < 4) ||
                                        isLoading
                                    ) ? "client-confirm-number" : undefined
                                }
                                loading={isLoading}
                            >
                                Продолжить
                            </Button>
                        </>
                    ) : (
                        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={onValuesChange}>
                            {isNewClient && (
                                <div style={{ marginBottom: 16 }}>
                                    <Tag color="orange">Новый клиент - требуется заполнить информацию</Tag>
                                </div>
                            )}
                            <Row gutter={8}>
                                <Col span={16}>
                                    <Form.Item
                                        label="Имя"
                                        name="name"
                                        rules={[{ required: true, message: 'Введите имя' }]}
                                    >
                                        <Input prefix={<UserOutlined />} disabled={isLoading} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Пол"
                                        name="gender"
                                        rules={[{ required: true, message: 'Выберите пол' }]}
                                    >
                                        <Select disabled={isLoading}>
                                            <Option value="male"><ManOutlined /> М</Option>
                                            <Option value="female"><WomanOutlined /> Ж</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Дата рождения" name="birthDate">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabled={isLoading}
                                />
                            </Form.Item>

                            <Form.Item label="Скидка" name="discount">
                                <Input
                                    prefix={<PercentageOutlined />}
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item label="Email" name="email">
                                <Input prefix={<MailOutlined />} disabled={isLoading} />
                            </Form.Item>

                            <Form.Item label="Откуда о нас узнали" name="advertising">
                                <Select showSearch disabled={isLoading}>
                                    <Option value="Сайт/Интернет">Сайт/Интернет</Option>
                                    <Option value="Друзья">Друзья</Option>
                                    <Option value="Реклама">Реклама</Option>
                                </Select>
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={isLoading}
                                disabled={!isFormValid && !isFormInitiallyValid}
                                href={isFormValid || isFormInitiallyValid ? "#" : undefined}
                                data-button-id={isFormValid || isFormInitiallyValid ? "client-save" : undefined}
                            >
                                Сохранить
                            </Button>
                        </Form>
                    )}
                </Spin>
            </Modal>
        </>
    );
};

export default React.memo(NumberInputPadModal);