import React, { useState } from 'react';
import { Modal, Input, Table, Button, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import './PromoCodeModal.css'; // Подключаем стили

const { Column } = Table;

const PromoCodeModal = () => {
    const [visible, setVisible] = useState(false); // Состояние для управления видимостью модального окна
    const [promoCodes, setPromoCodes] = useState([]); // Состояние для хранения промокодов
    const [inputValue, setInputValue] = useState(''); // Состояние для значения поля ввода
    const [loading, setLoading] = useState(false); // Состояние для анимации загрузки

    // Функция для открытия модального окна
    const showModal = () => {
        setVisible(true);
    };

    // Функция для закрытия модального окна
    const handleClose = () => {
        setVisible(false);
    };

    // Функция для добавления промокода
    const addPromoCode = () => {
        if (inputValue) {
            setLoading(true); // Включаем анимацию загрузки

            // Внешняя функция для проверки промокода
            const newPromoCode = {
                key: Date.now(),
                certificate: inputValue,
                nominal: '0 руб.' // Пример номинала, можно заменить на динамический
            };

            // Внешняя функция для получения данных нового промокода
            window.getNewPromoCodeData = () => {
                return newPromoCode;
            };

            // Очищаем поле ввода
            setInputValue('');
        }
    };

    // Внешняя функция для добавления промокода в таблицу
    window.addPromoCodeToTable = (promoCode) => {
        setPromoCodes([...promoCodes, promoCode]);
        setLoading(false); // Выключаем анимацию загрузки
    };

    // Функция для удаления промокода
    const deletePromoCode = (key) => {
        setPromoCodes(promoCodes.filter(item => item.key !== key));
    };

    // Внешняя функция для получения списка промокодов
    window.getPromoCodes = () => {
        return promoCodes;
    };

    // Внешняя функция для загрузки промокодов на форму
    window.loadPromoCodes = (codes) => {
        setPromoCodes(codes);
    };

    return (
        <>
            {/* Кнопка для открытия модального окна */}
            <Button
                type="primary"
                icon={<GiftOutlined />}
                onClick={showModal}
                className="open-modal-button"
            >
                Ввести промокод
            </Button>

            {/* Модальное окно */}
            <Modal
                title="Ввод сертификатов"
                visible={visible}
                onOk={handleClose}
                onCancel={handleClose}
                footer={[
                    <Button key="back" onClick={handleClose}>
                        Закрыть
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleClose}>
                        Сохранить
                    </Button>,
                ]}
                className="promo-code-modal"
            >
                {/* Поле ввода промокода с анимацией загрузки */}
                <Spin spinning={loading}>
                    <Input
                        placeholder="Введите промокод"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onPressEnter={addPromoCode}
                        suffix={<PlusOutlined onClick={addPromoCode} style={{ cursor: 'pointer' }} />}
                        className="promo-input"
                        disabled={loading} // Блокируем поле ввода во время загрузки
                    />
                </Spin>

                {/* Таблица с добавленными промокодами */}
                <Table dataSource={promoCodes} pagination={false} className="promo-table">
                    <Column title="Сертификат" dataIndex="certificate" key="certificate" />
                    <Column title="Номинал" dataIndex="nominal" key="nominal" />
                    <Column
                        title="Действие"
                        key="action"
                        render={(text, record) => (
                            <span>
                                <DeleteOutlined
                                    style={{ color: 'red', cursor: 'pointer' }}
                                    onClick={() => deletePromoCode(record.key)}
                                />
                            </span>
                        )}
                    />
                </Table>
            </Modal>
        </>
    );
};

export default PromoCodeModal;