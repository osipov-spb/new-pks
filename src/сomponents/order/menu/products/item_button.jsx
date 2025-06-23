import React from "react";
import { Button, Tag, Row, Col } from 'antd';
import { PercentageOutlined } from "@ant-design/icons";

class ItemButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || {
                index: 0,
                id: 0,
                price: 0,
                discount: false,
                title: 'Без названия'
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

        return (
            <Button
                onClick={this.handleClick}
                style={{
                    height: '80px',
                    width: '125px',
                    margin: '4px',
                    padding: '6px 6px 4px 6px',
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#fff',
                    display: 'grid',
                    gridTemplateRows: '1fr auto',
                    gap: '4px',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    borderRadius: 0
                }}
            >
                <div style={{
                    fontSize: '11px',
                    lineHeight: '1.2',
                    textAlign: 'left',
                    alignSelf: 'start',
                    color: '#595959',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '4px'
                }}>
                    <this.BreakString text={data.title} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
        <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#262626'
        }}>
            {data.price} ₽
        </span>
                    {hasDiscount && (
                        <span style={{
                            fontSize: '10px',
                            color: '#1890ff',
                            border: '1px solid #1890ff',
                            borderRadius: '2px',
                            padding: '0 3px'
                        }}>
                акция
            </span>
                    )}
                </div>
            </Button>
        );
    }
}

export default ItemButton;