function cal(val) {
    highlightOperator(val)
    let inputX = parseFloat(document.getElementById('inputX').value);
    let inputY = parseFloat(document.getElementById('inputY').value);

    let result;
    switch (val) {
        case 'add':
            result = inputX + inputY
            break
        case 'subtract':
            result = inputX - inputY
            break
        case 'multiply':
            result = inputX * inputY
            break
        case 'divide':
            result = inputX / inputY
            break
        case 'pow':
            result = Math.pow(inputX, inputY)
            break
    }
    document.querySelector('.operator').value = val
    if (!isNaN(result)) {
        document.querySelector('.display').value = result
    }
}

function save() {
    const cloud = document.getElementById('cloud').checked
    const inputX = parseFloat(document.getElementById('inputX').value)
    const inputY = parseFloat(document.getElementById('inputY').value)
    const optr = document.querySelector('.operator').value
    const display = document.querySelector('.display').value

    let data = {
        'inputX': inputX,
        'inputY': inputY,
        'optr': optr === undefined ? null : optr,
        'outcome': display
    }

    if (cloud) {
        window.api.sendToMain('cloudSave', JSON.stringify(data))
        window.api.receiveFromMain("cloudSaveReturn", (data) => {
            if (data.status === 200) {
                document.querySelector('.result_from_server').innerHTML = 'Save to cloud successfully!'
            } else {
                document.querySelector('.result_from_server').innerHTML = 'Save to cloud failed!'
            }
        });
    } else {
        window.api.sendToMain('localSave', JSON.stringify(data))
        window.api.receiveFromMain('localSaveReturn', (data) => {
            document.querySelector('.result_from_server').innerHTML = data
        })
    }
}

function load() {
    const cloud = document.getElementById('cloud').checked
    if (cloud) {
        window.api.sendToMain('cloudLoad', null)
        window.api.receiveFromMain("cloudLoadReturn", (data) => {
            if (data.status === 200) {
                document.querySelector('.result_from_server').innerHTML = 'Load from cloud successfully!'
                document.getElementById('inputX').value = parseFloat(data.data.inputX)
                document.getElementById('inputY').value = parseFloat(data.data.inputY)
                document.querySelector('.operator').value = data.data.optr
                document.querySelector('.display').value = data.data.outcome
                highlightOperator(data.data.optr)
            } else {
                document.querySelector('.result_from_server').innerHTML = 'Load from cloud failed!'
            }
        });
    } else {
        window.api.sendToMain('localLoad', null)
        window.api.receiveFromMain('localLoadReturn', (data) => {
            document.getElementById('inputX').value = parseFloat(data.inputX)
            document.getElementById('inputY').value = parseFloat(data.inputY)
            document.querySelector('.operator').value = data.optr
            document.querySelector('.display').value = data.outcome
            highlightOperator(data.optr)
        })
    }
}

function highlightOperator(value) {
    if ('add' === value) {
        document.getElementById(value).style.borderColor = 'blue'
        document.getElementById('subtract').style.borderColor = null
        document.getElementById('multiply').style.borderColor = null
        document.getElementById('divide').style.borderColor = null
        document.getElementById('pow').style.borderColor = null
    } else if ('subtract' === value) {
        document.getElementById(value).style.borderColor = 'blue'
        document.getElementById('add').style.borderColor = null
        document.getElementById('multiply').style.borderColor = null
        document.getElementById('divide').style.borderColor = null
        document.getElementById('pow').style.borderColor = null
    } else if ('multiply' === value) {
        document.getElementById(value).style.borderColor = 'blue'
        document.getElementById('add').style.borderColor = null
        document.getElementById('subtract').style.borderColor = null
        document.getElementById('divide').style.borderColor = null
        document.getElementById('pow').style.borderColor = null
    } else if ('divide' === value) {
        document.getElementById(value).style.borderColor = 'blue'
        document.getElementById('add').style.borderColor = null
        document.getElementById('subtract').style.borderColor = null
        document.getElementById('multiply').style.borderColor = null
        document.getElementById('pow').style.borderColor = null
    } else if ('pow' === value) {
        document.getElementById(value).style.borderColor = 'yellow'
        document.getElementById('add').style.borderColor = null
        document.getElementById('subtract').style.borderColor = null
        document.getElementById('multiply').style.borderColor = null
        document.getElementById('divide').style.borderColor = null
    } else {
        document.getElementById('add').style.borderColor = null
        document.getElementById('subtract').style.borderColor = null
        document.getElementById('multiply').style.borderColor = null
        document.getElementById('divide').style.borderColor = null
        document.getElementById('pow').style.borderColor = null
    }
}