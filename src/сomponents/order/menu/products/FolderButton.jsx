// noinspection DuplicatedCode

import React from "react";
import {Button, Typography} from 'antd';
import {FolderOutlined} from "@ant-design/icons";

const { Text } = Typography;

class FolderButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || {
                index: 0,
                id: 0,
                discount: false,
                title: 'Без названия'
            },
            openFolder: props.openFolder
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

    handleClick = (e) => {
        if (this.state.openFolder) {
            this.state.openFolder(e, this.state.data.id);
        }
    };

    render() {
        const { data } = this.state;

        return (
            <Button
                onClick={this.handleClick}
                style={{
                    height: '70px',
                    width: '126px',
                    // margin: '4px',
                    padding: '6px 6px 4px 6px',
                    border: `1px solid ${data.discount ? '#ffd591' : '#d9d9d9'}`,
                    backgroundColor: '#fafafa',
                    display: 'grid',
                    gridTemplateRows: '1fr auto',
                    gap: '4px',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    borderRadius: '4px', // вместо 0
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: data.discount ? '#fa8c16' : '#8c8c8c'
                }}/>

                <div style={{
                    fontSize: '11px',
                    lineHeight: '1.2',
                    textAlign: 'left',
                    alignSelf: 'start',
                    color: '#595959',
                    paddingBottom: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}>
                    <FolderOutlined style={{
                        fontSize: '18px',
                        color: '#bfbfbf',
                        marginBottom: '4px'
                    }}/>
                    <Text strong><this.BreakString text={data.title}/></Text>
                </div>
            </Button>
        );
    }
}

export default FolderButton;