import {Progress, Space, Typography, Carousel, Button, Modal} from 'antd'
import React from "react";

// import "./motivation.css"
import {CompassOutlined, StopOutlined} from "@ant-design/icons";

const {Text, Title} = Typography;

class StopButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    componentDidMount() {

        this.setState({
            isModalOpen: false
        })

        window.stop_modal = (on_stop) => {

            this.setState(({
                isModalOpen: on_stop
            }));
            return true
        }

        this.stop_modal_new = (stop) => {
            this.setState(({
                isModalOpen: stop
            }));
        }


    }

    render() {
        return (<div>
            <Button href="#" data-button-id="menu-stop" icon={<StopOutlined/>} size='large' danger>
                Стоп
            </Button>
            <Modal
                open={this.state.isModalOpen}
                title='Стоп'
                footer={[
                    <Button key="Да" >
                        {/*// onClick={this.stop_modal(false)}*/}
                        Да
                    </Button>,
                    <Button key="submit" type="primary" >
                        {/*// onClick={this.stop_modal(false}*/}
                        Отмена
                    </Button>
                ]}
            >
                <p>Установить склад на стоп?</p>
                {/*<p>Some contents...</p>*/}
                {/*<p>Some contents...</p>*/}
            </Modal>
        </div>)
    }
}

export default StopButton;