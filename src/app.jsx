import React from 'react';
import Main from "./сomponents/main";

import moment from 'moment';
import 'moment/locale/ru'; // Импорт русской локализации
import { ConfigProvider } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';

moment.locale('ru'); // Установка русской локализации по умолчанию

const App = () => {
    return (<ConfigProvider locale={ru_RU}>
                <Main/>
            </ConfigProvider>)
}
export default App


