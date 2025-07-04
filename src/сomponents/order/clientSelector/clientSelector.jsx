import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { Input, Button, Row, Col, Modal, Select, DatePicker, Form, Spin, Tag } from 'antd';
import { PhoneOutlined, DeleteOutlined, UserOutlined, PercentageOutlined, ManOutlined, WomanOutlined, MailOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const { Option } = Select;

const NumberInputPadModal = ({ clientData, onClientChange }) => {
    const [inputValue, setInputValue] = useState(clientData?.phone || '+7');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNumberPad, setShowNumberPad] = useState(true);
    const [isNewClient, setIsNewClient] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const [isFormInitiallyValid, setIsFormInitiallyValid] = useState(false);

    const handleNumberClick = useCallback((number) => {
        setInputValue(prev => prev.length < 16 ? prev + number : prev);
    }, []);

    const handleDeleteClick = useCallback(() => {
        setInputValue(prev => prev.length > 2 ? prev.slice(0, -1) : prev);
    }, []);

    const handlePhoneFocus = useCallback(() => {
        setShowNumberPad(true);
        setShowAdditionalFields(false);
    }, []);

    const handleConfirmPhone = useCallback(() => {
        if (inputValue.length >= 11) {
            setIsLoading(true);
            setShowNumberPad(false);
        }
    }, [inputValue]);

    const onFinish = useCallback(async (values) => {
        setIsLoading(true);
        try {
            const clientData = {
                ...values,
                phone: inputValue,
                birthDate: values.birthDate ? values.birthDate.toISOString() : null
            };
            if (onClientChange) {
                await onClientChange(clientData);
            }
            setIsModalVisible(false);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, onClientChange]);

    const onValuesChange = useCallback((changedValues, allValues) => {
        setFormValues(allValues);
    }, []);

    const isFormValid = useMemo(() => {
        return (
            inputValue.length >= 11 &&
            formValues.name &&
            formValues.gender
        );
    }, [inputValue, formValues]);

    useEffect(() => {
        window.clientSelectorFillFormData = (data) => {
            setIsLoading(true);
            try {
                const parsedData = JSON.parse(data);
                console.log('Filling form with:', parsedData);

                setInitialFormData(parsedData);
                setIsNewClient(!!parsedData.newClient);

                const formData = {
                    name: parsedData.name,
                    discount: parsedData.discount,
                    gender: parsedData.gender,
                    advertising: parsedData.advertising,
                    birthDate: parsedData.birthDate ? moment(parsedData.birthDate) : null,
                    email: parsedData.email,
                };

                // Проверяем, заполнены ли обязательные поля
                const initiallyValid = (
                    parsedData.phone?.length >= 11 &&
                    parsedData.name &&
                    parsedData.gender
                );

                setIsFormInitiallyValid(initiallyValid);
                setFormValues(formData);

                if (parsedData.phone) {
                    setInputValue(parsedData.phone);
                    const newData = { phone: parsedData.phone };
                    if (onClientChange) {
                        onClientChange(newData);
                    }
                }

                form.setFieldsValue(formData);

                if (parsedData.phone?.length >= 11) {
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
            if (phone && phone.length >= 11) {
                setShowAdditionalFields(true);
                setShowNumberPad(false);
                const newData = { phone };
                if (onClientChange) {
                    onClientChange(newData);
                }
            }
        };

        window.clientSelectorSaveAndGetFormData = () => {
            const values = form.getFieldsValue();
            const currentData = {
                ...values,
                phone: inputValue,
                birthDate: values.birthDate ? values.birthDate.toISOString() : null
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
            setIsModalVisible(false);
        };

        return () => {
            delete window.clientSelectorFillFormData;
            delete window.clientSelectorSetPhone;
            delete window.clientSelectorSaveAndGetFormData;
            delete window.clientSelectorCloseForm;
        };
    }, [form, inputValue, onClientChange, isNewClient, initialFormData]);

    return (
        <>
            <Button
                onClick={() => {
                    setIsModalVisible(true);
                    setShowAdditionalFields(false);
                    setShowNumberPad(true);
            }}
                icon={<UserOutlined />}
            >
                {clientData?.phone || 'Гость'}
            </Button>

            <Modal
                title="Данные клиента"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setShowAdditionalFields(false);
                    setShowNumberPad(true);
                }}
                footer={null}
                width={500}
                destroyOnClose
            >
                <Spin spinning={isLoading} tip="Загрузка данных...">
                    <div style={{ marginBottom: 16 }}>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.replace(/[^0-9+]/g, ''))}
                            onFocus={handlePhoneFocus}
                            prefix={<PhoneOutlined />}
                            placeholder="+7 (___) ___-__-__"
                            disabled={isLoading}
                        />
                    </div>

                    {showNumberPad ? (
                        <>
                            <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '+', 0].map(num => (
                                    <Col span={8} key={num}>
                                        <Button
                                            block
                                            onClick={() => handleNumberClick(num)}
                                            style={{ height: 48, fontSize: 18 }}
                                        >
                                            {num}
                                        </Button>
                                    </Col>
                                ))}
                                <Col span={8}>
                                    <Button
                                        block
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteClick}
                                        style={{ height: 48 }}
                                    />
                                </Col>
                            </Row>
                            <Button
                                type="primary"
                                onClick={handleConfirmPhone}
                                block
                                disabled={inputValue.length < 11 || isLoading}
                                href="#"
                                data-button-id={!(inputValue.length < 11 || isLoading) ? "client-confirm-number" : undefined}
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