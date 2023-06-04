const CURRECY = ' руб.'
const STATUS_IN_LIMIT = 'Все хорошо'
const STATUS_OUT_OF_LIMIT = 'Все плохо'
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status-red'
const DEFAULT_SELECTED_CATEGORY = 'Категории'
const POPUP_OPENED = 'popup_open'
const BODY_FIXED = 'body_fixed'
const STORAGE_LIMIT = 'lastSetLimit'
const STORAGE_HISTORY = 'history'
const DEFAULT_LIMIT = 10000


const spendInputNode = document.querySelector ('.js-spend-input')
const limitInputNode = document.querySelector ('.js-limit-input')

const addButtonNode = document.querySelector ('.js-add-button')
const cancelButtonNode = document.querySelector ('.js-cancel-button')
const historyNode = document.querySelector ('.js-history')
const totalSumNode = document.querySelector ('.js-total')
const limitNode = document.querySelector ('.js-limit')
const statusNode = document.querySelector ('.js-status')
const selectedCategoryNode = document.querySelector ('.js-selected-category')
const nonSelectedCategoryNode = document.querySelector ('.js-non-selected-category')
const nonInputedSpendNode = document.querySelector ('.js-non-inputed-spend')


const bodyNode = document.querySelector('body');
const changeLimitPopupNode = document.querySelector('.change-limit-popup');
const changeLimitPopupContentNode = document.querySelector('.js-popup-content')
const changeLimitBtnNode = document.querySelector ('.js-change-limit-btn')
const changeLimitBtnCloseNode = document.querySelector('.js-change-limit-popup-close-btn');
const setLimitBtnNode = document.querySelector ('.Js-popup-set-limit-btn')

let LIMIT = DEFAULT_LIMIT


let spending = []

getHistoryFromStorage = function () {
    const spendingFromStorageString = localStorage.getItem (STORAGE_HISTORY)
    const spendingStorage = JSON.parse (spendingFromStorageString)
    spending = spendingStorage
}

const spend = getSpendFromInput()

if (!!localStorage.history) {
    getHistoryFromStorage ()
}
render (spending)

function saveHistoryToStorage () {
    const spendingStorageString = JSON.stringify (spending)
    localStorage.setItem(STORAGE_HISTORY, spendingStorageString)
}

addButtonNode.addEventListener ('click', addSpendToHistory )

function addSpendToHistory () {
    
    if (!spendInputNode.value) {
        nonInputedSpendNode.removeAttribute ('hidden', '')
        return
    }

    nonInputedSpendNode.setAttribute ('hidden', '')
    
    const spend = parseInt(spendInputNode.value)
    
    const currentCategory = getSelectedCategory ()
    if (currentCategory === 'Категории') {
        nonSelectedCategoryNode.removeAttribute ('hidden', '')
        return
    } else {
        nonSelectedCategoryNode.setAttribute ('hidden', '')
        const newSpend = {currentSpend: spend, category: selectedCategoryNode.value}
        
        spending.push (newSpend)
        saveHistoryToStorage ()
        
        render (spending)
    }
    spendInputNode.value = ''
    selectedCategoryNode.value = DEFAULT_SELECTED_CATEGORY
}



function clearHistory () {
    LIMIT = DEFAULT_LIMIT
    removeSpendingFromHistory (historyNode)
    removeSavedLocalStorage ()
    render (spending)
}

cancelButtonNode.addEventListener ('click', clearHistory)

// Popup

changeLimitBtnNode.addEventListener ('click', togglePopup)
changeLimitBtnCloseNode.addEventListener('click', togglePopup)

changeLimitPopupNode.addEventListener('click', (event) => {
    const isClickOutsideContent = !event.composedPath().includes(changeLimitPopupContentNode)
    
    if (isClickOutsideContent) {
        togglePopup();
    }
})

function togglePopup() {
    changeLimitPopupNode.classList.toggle(POPUP_OPENED)
    bodyNode.classList.toggle(BODY_FIXED);
}

setLimitBtnNode.addEventListener ('click', function () {
    if (!limitInputNode.value) {
        return
    }

    LIMIT = parseInt(limitInputNode.value)
    limitInputNode.value = ''

    changeLimitPopupNode.classList.toggle(POPUP_OPENED)

    localStorage.setItem(STORAGE_LIMIT, LIMIT)

    render (spending)
})

function init(spending) {addButtonNode
    if (!localStorage.getItem(STORAGE_LIMIT)) {
        limitNode.innerText = LIMIT
    } else {
        LIMIT = localStorage.getItem (STORAGE_LIMIT)
        limitNode.innerText = localStorage.getItem (STORAGE_LIMIT)
    }
    statusNode.innerText = STATUS_IN_LIMIT
    totalSumNode.innerText = calculateSpending (spending)
}

function getLimitValue () {
    LIMIT = limitInputNode.value
}

function getSpendFromInput () {
    if (!spendInputNode.value) {
        return null
    }
    const spend = parseInt(spendInputNode.value)
    spendInputNode.value = ''
    return spend
}

function removeSpendingFromHistory () {
    spending.splice (0)
}

function removeSavedLocalStorage () {
    localStorage.removeItem (STORAGE_HISTORY)
    localStorage.removeItem (STORAGE_LIMIT)
}

function renderHistory (spending) {
    let spendingListHTML = ''
    
    spending.forEach(newSpend => {
        spendingListHTML += `<li>${newSpend.category} - ${newSpend.currentSpend} ${CURRECY}</li>`
    });
    
    historyNode.innerHTML = `<ol>${spendingListHTML}</ol>`
}

function calculateSpending (spending) {
    let sum = 0
    
    spending.forEach(function (newSpend) {
        sum += newSpend.currentSpend
    });

    return sum
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
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${LIMIT - sum} ${CURRECY})`
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME)
    }
}

function render (spending) {
    init(spending)
    renderHistory (spending)
    renderSum (spending)
    renderStatus (spending)
}

function getSelectedCategory () {
    return selectedCategoryNode.value
}
//