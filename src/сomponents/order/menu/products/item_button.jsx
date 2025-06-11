import React from "react";
import {Button, Tag, Row, Col} from 'antd'
import {PercentageOutlined} from "@ant-design/icons";

class ItemButton extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.data==undefined){
            this.state = {
                data: {
                    index: 0,
                    id: 0,
                    price: 0,
                    discount: false,
                    title: 'Без названия'
                }
            }
        }else {
            this.state = {
                data: {
                    index: this.props.data.index,
                    id: this.props.data.id,
                    price: this.props.data.price,
                    discount: this.props.data.discount,
                    title: this.props.data.title
                }
            }
        }
    }

    FitString = (text) =>{
        const firstPart = text.substring(0,8);
        var secondPart = text.substring(8);
        var  replacedSpace = secondPart.replace( " ",  " \n"); //text1.slice(0, 15) + " \n" + text1.slice(15);
        if (replacedSpace.length > 15){
            const firstPart2 = replacedSpace.substring(0,8);
            var secondPart2 = replacedSpace.substring(8);
            var  replacedSpace2 = secondPart2.replace( " ",  " \n");
            if (replacedSpace2.length > 24){

                return firstPart + firstPart2 + replacedSpace2.substring(0,21) + '...'
            }
            else{
                return firstPart + firstPart2 + replacedSpace2;}
        }else{
            return firstPart + replacedSpace;
        }
    }

    BreakString = ({ text }) => {
        const strArr = this.FitString(text).split("\n");
        return (
            <>
                {strArr.map((str, index) => (
                    <React.Fragment key={index}>
                        {str}
                        {index !== str.length - 1 && <br />}
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
                onClick={() => window.order_product_list_AddItem(this.state.data.title, this.state.data.id, this.state.data.price)}
            >
                <div style={{
                    position: "absolute",
                    top: "6%",
                    left: "6%",
                    width: "100%",
                    height: "37%",
                }}>
                    <Row align="top">
                        <Col span={24}>
                            <Tag color="#40a9ff" ><div >{this.state.data.price} ₽</div></Tag>
                               {this.state.data.discount ? (
                                   <Tag color="#ff7a45"><PercentageOutlined /></Tag>
                               ) : null}
                        </Col>

                    </Row>
                </div>
                <div style={{
                    position: "absolute",
                    top: "34%",
                    width: "100%",
                    height: "63%",
                    textAlign: "center",
                    padding: "5px 5px 5px 5px"
                }}>
                    <Row>
                        <Col span={24}>
                            <this.BreakString text={this.state.data.title}/>
                        </Col>
                    </Row>
                </div>

            </Button>
        )
    };
}

export default ItemButton