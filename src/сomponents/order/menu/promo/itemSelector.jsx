import React, { useState } from "react";
import { Select, Tabs } from 'antd';

const { Option } = Select;
const { TabPane } = Tabs;

const ItemSelector = ({ items, count, selectedItems, onSelect }) => {
    const [selections, setSelections] = useState(Array(count).fill(null));

    const handleChange = (value, index) => {
        const newSelections = [...selections];
        const selectedItem = items.find(item => item.id === value);

        newSelections[index] = selectedItem;
        setSelections(newSelections);

        if (selectedItem) {
            onSelect(selectedItem);
        }
    };

    return (
        <Tabs centered size="small">
            {Array.from({ length: count }).map((_, index) => (
                <TabPane
                    tab={`${index + 1}`}
                    key={`item-${index}`}
                >
                    <Select
                        style={{ width: '270px' }}
                        placeholder="Выберите позицию из списка"
                        onChange={(value) => handleChange(value, index)}
                        value={selections[index]?.id}
                    >
                        {items.map(item => (
                            <Option
                                key={item.id}
                                value={item.id}
                                disabled={selectedItems.some(selected => selected.id === item.id)}
                            >
                                {item.title}
                            </Option>
                        ))}
                    </Select>
                </TabPane>
            ))}
        </Tabs>
    );
};

export default ItemSelector;