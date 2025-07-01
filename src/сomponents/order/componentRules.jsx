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
        disabled: (orderData) => orderData.client.phone === null,
        hidden: (orderData) => orderData.package != 'delivery'
    },
    addressFields: {
        disabled: (orderData) => {
            return orderData.id != '';
        },
        hidden: (orderData) => false
    },
    courierFields: {
        disabled: (orderData) => orderData.status != '3.Ожидает',
        hidden: (orderData) => false
    },
    promoEditButton: {
        disabled: (orderData) => orderData.id != '',
        hidden: (orderData) => false
    },
    productsEditButton: {
        disabled: (orderData) => orderData.id != '',
        hidden: (orderData) => false
    }
    // ... другие компоненты
};