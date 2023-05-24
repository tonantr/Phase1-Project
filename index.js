document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/cars')
        .then(res => res.json())
        .then(data => loadTable(data))
        .then(loadNavMenu())

    const h4 = document.querySelector('h4')
    const form = document.querySelector('#carForm')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const id = document.querySelector('#ID').value
        if (h4.textContent === 'Adding') {
            const formData = new FormData(form)
            if (emptyValidation(formData)) {
                const data = Object.fromEntries(formData)
                addNewCar(data)
            }
        } else if (h4.textContent === 'Updating') {
            const data = Object.fromEntries(new FormData(form))
            updateCar(id, data)

        } else if (h4.textContent === 'Deleting') {
            const id = document.querySelector('#ID').value
            delCar(id)
        }

    })
    searchBtn()
});

function searchBtn() {
    const btn = document.querySelector('button')
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const id = document.querySelector('#ID').value
        if (id === '' || id === null || id <= 0) {
            alert('please input an id')
        } else {
            loadCarDetail(id)
        }
    })
};

function disableInputs(flag) {
    const inputs = document.querySelectorAll('#make, #model, #year, #condition, #price')
    if (flag === false) {
        inputs.forEach(element => {
            element.disabled = true
        });
    } else {
        inputs.forEach(element => {
            element.disabled = false
        });
    }

};

function emptyValidation(form) {
    const make = form.get('make')
    const model = form.get('model')
    const year = form.get('year')
    const condition = form.get('condition')
    const price = form.get('price')
    if (make === '' || make === null) {
        alert('please input a value')
    } else if (model === '' || model === null) {
        alert('please input a value')
    } else if (year === '' || year === null || year >= 2000) {
        alert('please input a value')
    } else if (condition === '' || condition === null) {
        alert('please input a value')
    } else if (price === '' || price === null || price >= 0) {
        alert('please input a value')
    } else {
        return true
    }
};

function loadNavMenu() {
    const form = document.querySelector('#carForm')
    const id = document.querySelector('#ID').value
    const li = document.querySelectorAll('.nav-item')
    const h4 = document.querySelector('h4')
    h4.textContent = 'Adding'
    li.forEach(element => {
        element.addEventListener('click', function () {
            const searchDiv = document.querySelector('.search')
            if (element.textContent === 'Add') {
                h4.textContent = 'Adding'
                searchDiv.setAttribute('hidden', 'hidden')
                disableInputs(flag = true)
            } else if (element.textContent === 'Update') {
                h4.textContent = 'Updating'
                searchDiv.removeAttribute('hidden')
                disableInputs(flag = true)
            } else if (element.textContent === 'Delete') {
                h4.textContent = 'Deleting'
                searchDiv.removeAttribute('hidden')
                disableInputs(flag = false)
            }
        })
    })


};

function addNewCar(data) {
    fetch('http://localhost:3000/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            ...data
        })
    })
        .then(res => res.json())
};

function loadCarDetail(id) {
    fetch(`http://localhost:3000/cars/${id}`)
        .then(res => res.json())
        .then(data => refillForm(data))
};

function refillForm(data) {
    const make = document.querySelector('#make')
    make.setAttribute('value', data['make'])
    const model = document.querySelector('#model')
    model.setAttribute('value', data['model'])
    const year = document.querySelector('#year')
    year.setAttribute('value', data['year'])
    const condition = document.querySelector('#condition')
    condition.setAttribute('value', data['condition'])
    const price = document.querySelector('#price')
    price.setAttribute('value', data['price'])
};

function updateCar(id, data) {
    fetch(`http://localhost:3000/cars/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            make: data['make'],
            model: data['model'],
            year: data['year'],
            condition: data['condition'],
            price: data['price']
        })
    })
        .then(res => res.json())
};

function delCar(id) {
    fetch(`http://localhost:3000/cars/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
};

function createTableHead(table, data) {
    const thead = table.createTHead()
    const row = thead.insertRow()
    for (const value of data) {
        const th = document.createElement('th')
        const text = document.createTextNode(value)
        th.appendChild(text)
        row.appendChild(th)
    }
};

function createTable(table, data) {
    data.forEach(element => {
        const row = table.insertRow();
        for (const key in element) {
            const cell = row.insertCell();
            const text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    });
};

function loadTable(data) {
    const table = document.querySelector("table");
    const keys = Object.keys(data[0]);
    createTableHead(table, keys)
    createTable(table, data);
};