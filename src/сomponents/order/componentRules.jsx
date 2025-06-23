import OrderAddressBlock from "./orderAddressBlock";

export const componentRules = {
    // Правила для _ProductsMenu
    productsMenu: {
        disabled: (orderData) => {
            return orderData.id != '';
        },
        hidden: (orderData) => {
            return false;
        }
    },
    orderHeader: {
        disabled: (orderData) => {
            return orderData.id != '';
        },
        hidden: (orderData) => false
    },
    statusButtonsPrint: {
        disabled: (orderData) => {
            return orderData.id === '';
        },
        hidden: (orderData) => false
    },
    statusButtonsPay: {
        disabled: (orderData) => orderData.paid,
        hidden: (orderData) => false
    },
    statusButtonsNext: {
        disabled: (orderData) => false,
        hidden: (orderData) => false
    },
    productTable: {
        disabled: (orderData) => orderData.id,
        hidden: (orderData) => false
    },
    addressBlock: {
        disabled: (orderData) => false,
        hidden: (orderData) => orderData.package != 'delivery'
    },
    // ... другие компоненты
};