const LIMIT = 10000
const CURRECY = ' руб.'
const STATUS_IN_LIMIT = 'Все хорошо'
const STATUS_OUT_OF_LIMIT = 'Все плохо'
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status-red'


const inputNode = document.querySelector ('.js-input')

const addButtonNode = document.querySelector ('.js-add-button')
const cancelButtonNode = document.querySelector ('.js-cancel-button')
const historyNode = document.querySelector ('.js-history')
const totalSumNode = document.querySelector ('.js-total')
const limitNode = document.querySelector ('.js-limit')
const statusNode = document.querySelector ('.js-status')

const selectedCategoryNode = document.querySelector ('.js-selected-category')

const spending = []

init(spending)



addButtonNode.addEventListener ('click', function () {
    
    //1. Приводим значение к числу
    if (!inputNode.value) {
        return
    }

    const spend = parseInt(inputNode.value)
    inputNode.value = ''

    const currentCategory = getSelectedCategory ()

    //2. Пушим в массив вводимые значения
    trackSpend (spend)

    render (spending)
    
})

cancelButtonNode.addEventListener ('click', function () {
    cancelHistory (historyNode)
    render (spending)
})



function trackSpend (spend) {
    spending.push (spend)
}

function getSpendFromInput () {
    if (!inputNode.value) {
        return null
    }

    const spend = parseInt(inputNode.value)


    inputNode.value = ''

    return spend
}

function init(spending) {addButtonNode
    limitNode.innerText = LIMIT
    statusNode.innerText = STATUS_IN_LIMIT
    totalSumNode.innerText = calculateSpending (spending)
}

function calculateSpending (spending) {
    let sum = 0
    
    spending.forEach(element => {
        sum += element
    });

    return sum
}

function cancelHistory () {
    spending.splice (0)
}


function renderHistory (spending) {
    let spendingListHTML = ''
    
    spending.forEach(element => {
        spendingListHTML += `<li>${element}${CURRECY}</li>`
    });

    historyNode.innerHTML = `<ol>${spendingListHTML}</ol>`
    
    console.log (spendingListHTML)
}

function renderSum (spending) {
    totalSumNode.innerText = calculateSpending (spending)
}

function renderStatus (spending) {
    const sum = calculateSpending (spending)

    if(sum <= LIMIT) {
        statusNode.innerText = STATUS_IN_LIMIT
        statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME)
    } else {
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${LIMIT - sum}) ${CURRECY}`
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME)
    }
}

function render (spending) {
    renderHistory (spending)
    renderSum (spending)
    renderStatus (spending)
}

function getSelectedCategory () {
    return selectedCategoryNode
}