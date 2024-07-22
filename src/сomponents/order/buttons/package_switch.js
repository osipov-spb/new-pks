import React from 'react'
import {Radio} from "antd";

const _PackageSwitch = () => {
    const onChange = (e) => {
        if(e.target.value=='in_store'){
            sessionStorage.setItem('package', 'in_store')
        }else if (e.target.value=='take_away') {
            sessionStorage.setItem('package', 'take_away')
        }
        console.log(sessionStorage.getItem('base_path'))
    };

    return (
        <div className='package-switch'>
            <Radio.Group onChange={onChange} defaultValue="in_store" buttonStyle="solid">
                <Radio.Button value="in_store">Офис</Radio.Button>
                <Radio.Button value="take_away">Krol</Radio.Button>
            </Radio.Group>
        </div>
    )
}

export default _PackageSwitch