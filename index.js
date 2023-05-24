document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/cars')
        .then(res => res.json())
        .then(data => loadTable(data))

    const subBtn = document.querySelector('#submit')
    const form = document.querySelector('#carForm')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const id = document.querySelector('#ID').value
        if (subBtn.value === 'Add') {
            const formData = new FormData(form)
            if (emptyValidation(formData)) {
                const data = Object.fromEntries(formData)
                addNewCar(data)
            }
        } else if (subBtn.value === 'Update') {
            const data = Object.fromEntries(new FormData(form))
            updateCar(id, data)

        } else if (subBtn.value === 'Delete') {
            const id = document.querySelector('#ID').value
            deleteCar(id)
            
        }

    })
    searchBtn()
    loadNavMenu()
});

function searchBtn() {
    const searchBtn = document.querySelector('#search')
    searchBtn.addEventListener('click', () => {
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
        alert('Make must be filled out')
    } else if (model === '' || model === null) {
        alert('Model must be filled out')
    } else if (year === '' || year === null || year <= 2000) {
        alert('Year must be filled out')
    } else if (condition === '' || condition === null) {
        alert('Condition must be filled out')
    } else if (price === '' || price === null || price <= 0) {
        alert('Price must be filled out')
    } else {
        return true
    }
};

function loadNavMenu() {
    const form = document.querySelector('#carForm')
    const id = document.querySelector('#ID').value
    const li = document.querySelectorAll('.nav-item')
    const subBtn = document.querySelector('#submit')
    subBtn.value = 'Add'
    li.forEach(element => {
        element.addEventListener('click', function () {
            //const searchDiv = document.querySelector('.search')
            if (element.textContent === 'Add') {
                subBtn.value = 'Add'
                searchDiv.setAttribute('hidden', 'hidden')
                disableInputs(flag = true)
            } else if (element.textContent === 'Update') {
                subBtn.value = 'Update'
                searchDiv.removeAttribute('hidden')
                disableInputs(flag = true)
            } else if (element.textContent === 'Delete') {
                subBtn.value = 'Delete'
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

function deleteCar(id) {
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