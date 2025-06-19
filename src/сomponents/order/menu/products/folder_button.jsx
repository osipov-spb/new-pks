import React from "react";
import {Button, Tag, Row, Col} from 'antd'
import {FolderOpenOutlined, PercentageOutlined} from "@ant-design/icons";

class FolderButton extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.data==undefined){
            this.state = {
                data: {
                    index: 0,
                    // price: 0,
                    discount: false,
                    title: 'Без названия',
                    openFolder: undefined
                }
            }
        }else {
            this.state = {
                data: {
                    id: this.props.data.id,
                    // price: this.props.data.price,
                    discount: this.props.data.discount,
                    title: this.props.data.title,
                    openFolder: this.props.openFolder
                }
            }
        }
    }

    BreakString = ({ text }) => {
        const MAX_LINE_LENGTH = 15; // Максимальная длина строки до переноса
        const MAX_LINES = 3; // Максимальное количество строк
        const ELLIPSIS = '...'; // Многоточие для обрезанного текста

        // Функция для разбиения текста на строки
        const splitTextIntoLines = (text) => {
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0] || '';

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                // Если текущая строка + следующее слово не превышают максимальную длину
                if (currentLine.length + word.length + 1 <= MAX_LINE_LENGTH) {
                    currentLine += ' ' + word;
                } else {
                    // Если достигли максимального количества строк
                    if (lines.length + 1 >= MAX_LINES) {
                        // Обрезаем текущую строку, если нужно
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
            return lines.slice(0, MAX_LINES); // Возвращаем не более MAX_LINES строк
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

    componentDidMount() {

    }

    render() {
        return (
            <Button
                key={this.state.data.index}
                className={"style-btn"}
                onClick={(e) => {this.state.data.openFolder(e, this.state.data.id)}}
            >
                {/*<div style={{*/}
                {/*    position: "absolute",*/}
                {/*    top: "6%",*/}
                {/*    left: "6%",*/}
                {/*    width: "100%",*/}
                {/*    height: "37%",*/}
                {/*}}>*/}
                {/*    <Row align="top">*/}
                {/*        /!*<Col span={23}>*!/*/}
                {/*        /!*    *!/*/}
                {/*        /!*</Col>*!/*/}

                {/*    </Row>*/}
                {/*</div>*/}
                <div style={{
                    // position: "absolute",
                    // top: "34%",
                    // width: "100%",
                    // height: "100%",
                    // textAlign: "center",
                    // padding: "5px 5px 5px 5px"
                }}>
                    <Row>
                        <Col span={24}>
                            {/*<Tag><FolderOpenOutlined /></Tag>*/}
                            <this.BreakString text={this.state.data.title}/>
                        </Col>
                    </Row>
                </div>

            </Button>
        )
    };
}

export default FolderButton