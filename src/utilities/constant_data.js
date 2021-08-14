const startingData = [
    {
        category:
        {
            name: 'Opening Balance',
            type: 'income',
            userCreated: false,
            deleted: false
        },
        subCategory: [
            {
                name: 'Other',
                type: 'income',
                userCreated: false,
                deleted: false
            }
        ]
    },
    {
        category:
        {
            name: 'Food',
            type: 'expense',
            userCreated: false,
            deleted: false
        },
        subCategory: [
            {
                name: 'BreakFast',
                type: 'expense',
                userCreated: false,
                deleted: false
            },
            {
                name: 'Lunch',
                type: 'expense',
                userCreated: false,
                deleted: false
            },
            {
                name: 'Dinner',
                type: 'expense',
                userCreated: false,
                deleted: false
            }
        ]
    },
    {
        category:
        {
            name: 'Transportation',
            type: 'expense',
            userCreated: false,
            deleted: false
        },
        subCategory: [
            {
                name: 'Metro',
                type: 'expense',
                userCreated: false,
                deleted: false
            },
            {
                name: 'Fuel',
                type: 'expense',
                userCreated: false,
                deleted: false
            }
        ]
    }
]

const sequenceData = [
    {
        _id: "user",
        sequenceValue: 90000000
    },
    {
        _id: "budget",
        sequenceValue: 0
    },
    {
        _id: "account",
        sequenceValue: 100
    },
    {
        _id: "category",
        sequenceValue: 1000
    },
    {
        _id: "subCategory",
        sequenceValue: 10000
    },
    {
        _id: "transaction",
        sequenceValue: 1000000000
    },
    {
        _id: "allocation",
        sequenceValue: 100000000
    }
]
module.exports = {
    ER_1001_USER_NOT_FOUND: {
        error_message: 'User does not exist',
        error_code: 'ER_1001',
    },
    ER_1002_ACCOUNT_NOT_FOUND: 'Account does not exist',
    ER_1003_BUDGET_NOT_FOUND: 'Budget does not exist',
    ER_1004_CATEGORY_NOT_FOUND: 'Category does not exist',
    ER_1005_SUB_CATEGORY_NOT_FOUND: 'Sub Category does not exist',
    startingData,
    sequenceData
}