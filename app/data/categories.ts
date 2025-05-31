export const categoryIds = {
    coffee: {
        start: "1",
        end: "10",
        products: [
            { id: "1", name: "Caramel Macchiato" },
            { id: "2", name: "Hazelnut Latte" },
            { id: "3", name: "Mocha Delight" },
            { id: "4", name: "Iced Americano" },
            { id: "5", name: "Coconut Cold Brew" },
            { id: "6", name: "Pumpkin Spice Latte" },
            { id: "7", name: "Espresso Con Panna" },
            { id: "8", name: "Vanilla Latte" },
            { id: "9", name: "Flat White" },
            { id: "10", name: "Irish Coffee" }
        ]
    },
    milkTea: {
        start: "11",
        end: "17",
        products: [
            { id: "11", name: "Brown Sugar Milk Tea" },
            { id: "12", name: "Taro Milk Tea" },
            { id: "13", name: "Honeydew Milk Tea" },
            { id: "14", name: "Thai Milk Tea" },
            { id: "15", name: "Wintermelon Milk Tea" },
            { id: "16", name: "Chocolate Milk Tea" },
            { id: "17", name: "Hokkaido Milk Tea" }
        ]
    },
    matchaLatte: {
        start: "18",
        end: "22",
        products: [
            { id: "18", name: "Matcha Latte" },
            { id: "19", name: "Vanilla Matcha" },
            { id: "20", name: "Honey Matcha" },
            { id: "21", name: "Creamy Matcha" },
            { id: "22", name: "Mint Matcha" }
        ]
    },
    fruitTea: {
        start: "23",
        end: "29",
        products: [
            { id: "23", name: "Peach Tea" },
            { id: "24", name: "Lemon Tea" },
            { id: "25", name: "Passion Fruit Tea" },
            { id: "26", name: "Mango Tea" },
            { id: "27", name: "Lychee Tea" },
            { id: "28", name: "Strawberry Tea" },
            { id: "29", name: "Grapefruit Tea" }
        ]
    }
};

export const isInCategory = (productId: string, category: string): boolean => {
    const categoryMap: Record<string, string> = {
        'coffee': 'coffee',
        'milk-tea': 'milkTea',
        'matcha': 'matchaLatte',
        'fruit-tea': 'fruitTea',
        // Direct mappings
        'milktea': 'milkTea',
        'matchalatte': 'matchaLatte',
        'fruittea': 'fruitTea'
    };

    const categoryKey = categoryMap[category.toLowerCase()] || category;

    switch (categoryKey) {
        case 'coffee':
            return Number(productId) >= Number(categoryIds.coffee.start) && Number(productId) <= Number(categoryIds.coffee.end);
        case 'milkTea':
            return Number(productId) >= Number(categoryIds.milkTea.start) && Number(productId) <= Number(categoryIds.milkTea.end);
        case 'matchaLatte':
            return Number(productId) >= Number(categoryIds.matchaLatte.start) && Number(productId) <= Number(categoryIds.matchaLatte.end);
        case 'fruitTea':
            return Number(productId) >= Number(categoryIds.fruitTea.start) && Number(productId) <= Number(categoryIds.fruitTea.end);
        default:
            return true;
    }
};
