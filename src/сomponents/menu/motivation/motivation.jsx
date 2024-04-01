import {Progress, Space, Typography, Carousel} from 'antd'
import React from "react";

import "./motivation.css"

const {Text, Title} = Typography;

class Motivation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        const _plan_completion = 0
        const _leader = ""
        const _place = 0
        const _trend = 0

        this.setState({
            plan_completion: _plan_completion, leader: _leader, place: _place, trend: _trend, dotPosition: 'left'
        })

        window.motivation_SetData = (_plan_completion, _leader, _place, _trend) => {
            this.setState(({
                plan_completion: _plan_completion, leader: _leader, place: _place, trend: _trend
            }));
            return true
        }
    }

    render() {
        return (<div className='customCarousel'>
            <Carousel autoplay autoplaySpeed={10000} dots={false} dotPosition='right'>
                <div className='carousel-slide'>
                    <Space size='middle' direction="horizontal"><Text>Выполнение плана</Text><Progress type="circle"
                                                                                                       percent={this.state.plan_completion}
                                                                                                       width={45}/></Space>
                </div>
                <div className='carousel-slide'>
                    <Space direction="horizontal"><Text>Лидер продаж: <Text
                        type="secondary">{this.state.leader}</Text></Text></Space>
                </div>
                <div className='carousel-slide'>
                    <Space direction="horizontal"><Text>Ваше место: <Text
                        type="secondary">{this.state.place}</Text></Text></Space>
                </div>
                <div className='carousel-slide'>
                    <Space direction="horizontal"><Text>Тенденция: <Text
                        type="secondary">{this.state.trend}</Text></Text></Space>
                </div>
            </Carousel>
        </div>)
    }
}

export default Motivation;