import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Modal, Select, DatePicker, Form, Divider, Spin, Alert } from 'antd';
import { PhoneOutlined, DeleteOutlined, UserOutlined, PercentageOutlined, ManOutlined, WomanOutlined, CalendarOutlined, MailOutlined } from '@ant-design/icons';
import moment from 'moment'; // Импорт moment

const { Option } = Select;

const NumberInputPadModal = () => {
    const [inputValue, setInputValue] = useState('+7');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNumberPad, setShowNumberPad] = useState(true); // Состояние для отображения блока с цифрами
    const [isNewClient, setIsNewClient] = useState(false); // Состояние для отображения сообщения о новом клиенте
    const [initialFormData, setInitialFormData] = useState(null); // Исходные данные формы
    const [form] = Form.useForm();

    const handleNumberClick = (number) => {
        setInputValue((prevValue) => prevValue + number);
    };

    const handleDeleteClick = () => {
        if (inputValue.length > 2) {
            setInputValue((prevValue) => prevValue.slice(0, -1));
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        setShowAdditionalFields(false);
        setIsLoading(false);
        setShowNumberPad(true); // Сбрасываем состояние блока с цифрами
        setIsNewClient(false); // Сбрасываем состояние нового клиента
        setInitialFormData(null); // Сбрасываем исходные данные
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setInputValue('+7');
        form.resetFields();
        setShowAdditionalFields(false);
        setIsLoading(false);
        setShowNumberPad(true); // Сбрасываем состояние блока с цифрами
        setIsNewClient(false); // Сбрасываем состояние нового клиента
        setInitialFormData(null); // Сбрасываем исходные данные
    };

    const onFinish = (values) => {
        // Логика обработки данных формы
    };

    const onSkip = () => {
        console.log('Пользователь пропустил ввод данных');
        window.clientSelectorFillFormData(null);
        setIsModalVisible(false);
    };

    const handleConfirmPhone = () => {
        if (inputValue.length >= 11) {
            setShowAdditionalFields(true);
            setIsLoading(true);
            setShowNumberPad(false); // Скрываем блок с цифрами
        } else {
            alert('Пожалуйста, введите корректный номер телефона.');
        }
    };

    const handlePhoneInputFocus = () => {
        setShowNumberPad(true); // Разворачиваем блок с цифрами при активации поля ввода
        setShowAdditionalFields(false); // Скрываем правую часть
    };

    const handlePhoneInputChange = (e) => {
        const value = e.target.value;
        const sanitizedValue = value.replace(/[^0-9+]/g, '');
        setInputValue(sanitizedValue);
        if (showAdditionalFields) {
            form.resetFields(); // Очищаем дополнительные поля
            setShowAdditionalFields(false); // Блокируем дополнительные поля
        }
    };

    const advertisingOptions = [
        'Друзья, Знакомые',
        'Листовка у метро',
        'Магазин',
        'Листовка промо',
        'Сайт/Интернет',
        'Старый клиент',
        'Наружная реклама (щиты)',
        'Смс рассылка',
        'Листовка в ящике',
        'На стендах в парадных',
        'Яндекс Директ',
        'Реклама в лифте',
        'Листовка в пробке',
        'VK Fest',
        'УсадьбаJazz',
        'Опрос',
        'ВидФест',
        'Конференция МТС 2018',
        'Фестиваль Питер ялт 2018',
        'Вайбер 30',
        'Маятник Фуко 2018',
        'Game Planet 2018',
        'Промокодус',
        'Еврохим',
        'ООО «Позитифф СПБ»',
        'ООО «Гостиница «Киевская»',
        'ООО "СТРИТАРТ"',
        'ООО «ОХРАНА 812»',
        'ООО «Светлый город»',
        'ХК Динамо',
        'ГарантЭксперт',
        'ЛидерКонсалт',
        'ВКонтакте',
        'Билборд',
        'В вагоне метро',
        'ОКК',
        'Сотрудник компании',
        'ЯндексЕда',
        'Delivery',
        'Ozon',
        'Отказ от ответа',
        'ОООАватерра',
        '3ндфл.com',
        'Партнеры',
        'GTN-Quest',
        'Высотный Город',
        'Хомагочи',
    ];

    // Внешняя функция для получения данных формы
    window.clientSelectorGetFormData = () => {
        const formValues = form.getFieldsValue();
        const currentData = {
            ...formValues,
            phone: inputValue,
        };

        let action = 'saved'; // По умолчанию данные не изменены

        if (isNewClient) {
            action = 'create'; // Если это новый клиент
        } else if (initialFormData) {
            // Сравниваем текущие данные с исходными
            const isEdited = Object.keys(currentData).some(
                (key) => currentData[key] !== initialFormData[key]
            );
            if (isEdited) {
                action = 'edited'; // Если данные были изменены
            }
        }

        return JSON.stringify({
            ...currentData,
            action, // Добавляем свойство action
        });
    };

    // Внешняя функция для заполнения формы данными из JSON
    window.clientSelectorFillFormData = (data) => {
        data = JSON.parse(data);
        if (data.phone) {
            setInputValue(data.phone);
        }
        form.setFieldsValue({
            name: data.name,
            discount: data.discount,
            gender: data.gender,
            advertising: data.advertising,
            birthDate: data.birthDate ? moment(data.birthDate) : null,
            email: data.email,
        });
        if (data.phone && data.phone.length >= 11) {
            setShowAdditionalFields(true);
        }
        if (data.newClient) {
            setIsNewClient(true); // Показываем сообщение о новом клиенте
        } else {
            setIsNewClient(false); // Скрываем сообщение о новом клиенте
        }

        // Сохраняем исходные данные для сравнения
        setInitialFormData({
            phone: data.phone,
            name: data.name,
            discount: data.discount,
            gender: data.gender,
            advertising: data.advertising,
            birthDate: data.birthDate ? moment(data.birthDate) : null,
            email: data.email,
        });

        setIsLoading(false); // Выключаем анимацию загрузки
    };

    // Внешняя функция закрытия формы
    window.clientSelectorCloseForm = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button onClick={showModal} icon={<UserOutlined />}>
                Гость
            </Button>

            <Modal
                title="Данные клиента"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={showAdditionalFields ? 900 : 400}
                bodyStyle={{ padding: '24px' }}
                style={{ borderRadius: '12px' }}
            >
                <Row gutter={24}>
                    <Col span={showAdditionalFields ? 10 : 24}>
                        <Input
                            value={inputValue}
                            onChange={handlePhoneInputChange}
                            onFocus={handlePhoneInputFocus}
                            placeholder="Введите номер телефона"
                            prefix={<PhoneOutlined />}
                            style={{ marginBottom: '16px', borderRadius: '8px', textAlign: 'left' }}
                        />

                        {showNumberPad && (
                            <>
                                <Row gutter={[8, 8]}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '+', 0].map((item) => (
                                        <Col span={8} key={item}>
                                            <Button
                                                block
                                                onClick={() => handleNumberClick(item)}
                                                style={{ height: '48px', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px' }}
                                            >
                                                {item}
                                            </Button>
                                        </Col>
                                    ))}
                                    <Col span={8}>
                                        <Button
                                            block
                                            type="danger"
                                            onClick={handleDeleteClick}
                                            icon={<DeleteOutlined />}
                                            style={{ height: '48px', fontSize: '16px', borderRadius: '8px' }}
                                        >
                                            {/* Убрана надпись, оставлен только значок */}
                                        </Button>
                                    </Col>
                                </Row>

                                <Button
                                    href="#"
                                    data-button-id="client-confirm-number"
                                    type="primary"
                                    onClick={handleConfirmPhone}
                                    style={{ marginTop: '16px', width: '100%', borderRadius: '8px' }}
                                >
                                    Подтвердить номер
                                </Button>
                            </>
                        )}

                        {!showNumberPad && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    marginTop: '0px',
                                }}
                            >
                                <UserOutlined
                                    style={{
                                        fontSize: '133px',
                                        color: 'rgba(0, 0, 0, 0.3)',
                                        opacity: 0.3,
                                    }}
                                />
                            </div>
                        )}
                    </Col>

                    {showAdditionalFields && (
                        <Col span={2}>
                            <Divider type="vertical" style={{ height: '100%', margin: '0 24px' }} />
                        </Col>
                    )}

                    {showAdditionalFields && (
                        <Col span={11}>
                            <Spin spinning={isLoading} tip="Загрузка..." size="large">
                                {isNewClient && (
                                    <Alert
                                        message="Клиент не найден. Создание нового клиента"
                                        type="info"
                                        showIcon
                                        style={{ marginBottom: '16px' }}
                                    />
                                )}

                                <Form form={form} onFinish={onFinish} layout="vertical">
                                    <Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}>
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Введите имя клиента"
                                            style={{ borderRadius: '8px' }}
                                            disabled={!showAdditionalFields}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Скидка" name="discount">
                                        <Input
                                            type="number"
                                            prefix={<PercentageOutlined />}
                                            placeholder="Скидка"
                                            disabled
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Пол" name="gender" rules={[{ required: true, message: 'Пожалуйста, выберите пол' }]}>
                                        <Select placeholder="Выберите пол" style={{ borderRadius: '8px' }} disabled={!showAdditionalFields}>
                                            <Option value="male">
                                                <ManOutlined /> Мужской
                                            </Option>
                                            <Option value="female">
                                                <WomanOutlined /> Женский
                                            </Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Реклама" name="advertising">
                                        <Select
                                            placeholder="Выберите источник рекламы"
                                            style={{ borderRadius: '8px' }}
                                            disabled={!showAdditionalFields}
                                        >
                                            {advertisingOptions.map((option) => (
                                                <Option key={option} value={option}>
                                                    {option}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Дата рождения" name="birthDate">
                                        <DatePicker
                                            placeholder="Введите дату рождения"
                                            style={{ width: '100%', borderRadius: '8px' }}
                                            suffixIcon={<CalendarOutlined />}
                                            disabled={!showAdditionalFields}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Введите корректный email' }]}>
                                        <Input prefix={<MailOutlined />} placeholder="Введите ваш email" style={{ borderRadius: '8px' }} disabled={!showAdditionalFields} />
                                    </Form.Item>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Button block
                                                    href="#"
                                                    data-button-id="client-save"
                                                    type="primary"
                                                    htmlType="submit"
                                                    style={{ borderRadius: '8px' }}>
                                                Сохранить
                                            </Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button block
                                                    onClick={onSkip}
                                                    style={{ borderRadius: '8px' }}>
                                                Отмена
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Spin>
                        </Col>
                    )}
                </Row>
            </Modal>
        </div>
    );
};

export default NumberInputPadModal;