// noinspection DuplicatedCode,SpellCheckingInspection

import React from "react";
import {Button, Tag, Typography} from 'antd';

const { Text } = Typography;

class ItemButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || {
                index: 0,
                id: 0,
                price: 0,
                discount: false,
                title: 'Без названия',
                stop: false,
                composite: false,
                suggestion: false
            }
        };
    }

    BreakString = ({ text }) => {
        const MAX_LINE_LENGTH = 15;
        const MAX_LINES = 3;
        const ELLIPSIS = '...';

        const splitTextIntoLines = (text) => {
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0] || '';

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                if (currentLine.length + word.length + 1 <= MAX_LINE_LENGTH) {
                    currentLine += ' ' + word;
                } else {
                    if (lines.length + 1 >= MAX_LINES) {
                        const remainingLength = MAX_LINE_LENGTH - currentLine.length;
                        if (word.length > remainingLength) {
                            currentLine += ' ' + word.substring(0, remainingLength - ELLIPSIS.length) + ELLIPSIS;
                        } else {
                            currentLine += ' ' + word;
                        }
                        break;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
            }

            lines.push(currentLine);
            return lines.slice(0, MAX_LINES);
        };

        const lines = splitTextIntoLines(text);

        return (
            <>
                {lines.map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        {index !== lines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </>
        );
    };

    handleClick = () => {
        const { title, id, price } = this.state.data;
        if (window.orderAddItem) {
            window.orderAddItem(title, id, price);
        } else {
            console.error('orderAddItem function is not defined');
        }
    };

    render() {
        const { data } = this.state;
        const hasDiscount = Boolean(data.discount);
        const isStopped = Boolean(data.stop);
        const isComposite = Boolean(data.composite);
        const isSuggestion = Boolean(data.suggestion);

        return (
            <Button
                onClick={isStopped || isComposite ? null : this.handleClick}
                href="#"
                data-button-id={isSuggestion ? null : (isComposite ? `open-composite-form-id-${data.id}` : `product-select-id-${data.id}`)}
                style={{
                    height: '70px',
                    width: '120px',
                    // margin: '4px',
                    padding: '6px 6px 26px 6px', // Увеличиваем нижний padding для места под абсолютный блок
                    border: isStopped ? '1px solid #ffccc7' : (isSuggestion ? '1px solid #95de64' : '1px solid #91d5ff'),
                    background: isStopped ? 'linear-gradient(to bottom, #fff, #fff2f0)' : (isSuggestion ? 'linear-gradient(to bottom, #fff, #f6ffed)' : 'linear-gradient(to bottom, #fff, #f0f9ff)'),
                    display: 'block',
                    cursor: isStopped ? 'not-allowed' : 'pointer',
                    boxShadow: 'none',
                    borderRadius: '4px', // вместо 0
                    position: 'relative',
                    overflow: 'hidden',

                }}
            >
                {/* Полоска стоп-листа */}
                {isStopped && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(to right, #ff4d4f, #ff7875)'
                    }} />
                )}

                {!isStopped && !isSuggestion && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(to right, #1890ff, #69c0ff)'
                    }} />
                )}

                {!isStopped && isSuggestion && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(to right, #95de64, #73d13d)'
                    }} />
                )}

                {/* Блок названия (занимает всю доступную высоту) */}
                <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '4px'
                }}>
                    <div style={{
                        paddingTop:'5px',
                        fontSize: '11px',
                        lineHeight: '1.0',
                        textAlign: 'left',
                        color: isStopped ? '#8c8c8c' : '#595959',
                        width: '100%'
                    }}>
                        <Text strong><this.BreakString text={data.title} /></Text>
                    </div>
                </div>

                {/* Блок цены и тегов (абсолютное позиционирование) */}
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '6px',
                    right: '4px',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                }}>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: "500",
                        color: isStopped ? '#8c8c8c' : '#262626',
                        lineHeight: '20px'
                    }}>
                        {data.price} ₽
                    </span>

                    <div style={{
                        display: 'flex',
                    }}>
                        {hasDiscount && !isStopped && !isSuggestion && (
                            <Tag style={{
                                margin: 0,
                                marginLeft: '2px',
                                padding: '0 2px',
                                fontSize: '9px',
                                height: '20px',
                                lineHeight: '16px',
                                border: '1px solid #1890ff',
                                color: '#1890ff',
                                background: 'transparent',
                                borderRadius: '2px'
                            }}>
                                акция
                            </Tag>
                        )}
                        {isStopped && (
                            <Tag color="red" style={{
                                margin: 0,
                                marginLeft: '2px',
                                padding: '0 2px',
                                fontSize: '9px',
                                height: '20px',
                                lineHeight: '16px',
                                borderRadius: '2px'
                            }}>
                                стоп
                            </Tag>
                        )}
                        {isComposite && !isStopped && !isSuggestion && (
                            <Tag color="blue" style={{
                                margin: 0,
                                marginLeft: '2px',
                                padding: '0 2px',
                                fontSize: '9px',
                                height: '20px',
                                lineHeight: '16px',
                                borderRadius: '2px'
                            }}>
                                сборка
                            </Tag>
                        )}
                        {!isComposite && !isStopped && isSuggestion && (
                            <Tag color="green" style={{
                                margin: 0,
                                marginLeft: '2px',
                                padding: '0 2px',
                                fontSize: '9px',
                                height: '20px',
                                lineHeight: '16px',
                                borderRadius: '2px'
                            }}>
                                предложение
                            </Tag>
                        )}
                    </div>
                </div>
            </Button>
        );
    }
}


export default ItemButton;