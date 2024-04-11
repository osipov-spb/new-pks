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

        window.stop_modal_opener = (on_stop) => {
            this.setState(({
                isModalOpen: on_stop
            }));
            return true
        }

        // window.stop_close_modal = () => {
        //     this.setState(({
        //         isModalOpen: false
        //     }));
        // }
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
                    <Button key="Да" onClick={window.stop_modal_opener}>
                        Да
                    </Button>,
                    <Button key="submit" type="primary" onClick={window.stop_modal_opener}>
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