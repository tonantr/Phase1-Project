document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/cars')
        .then(res => res.json())
        .then(data => loadTable(data))
        .then(createMenu())

    const h4 = document.querySelector('h4')
    const form = document.querySelector('#carForm')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (h4.textContent === 'Adding') {
            const formData = new FormData(form)
            if (emptyValidation(formData)) {
                const data = Object.fromEntries(formData)
                addNewCar(data)
            }
        } else if(h4.textContent === 'Updating') {
            const id = document.querySelector('#ID').value
            const data = Object.fromEntries(new FormData(form))
            updateCar(id, data)
        } else if(h4.textContent === 'Deleting') {
            const id = document.querySelector('#ID').value
            delCar(id)
        }
        
    })

    const btn = document.querySelector('button')
    btn.addEventListener('click', () => {
        const id = document.querySelector('#ID').value
        if (id === '' || id === null || id <= 0) {
            alert('please input an id')
        } else {
            loadCarDetail(id)
        }
    })

});

function disableInput(form) {
    
}

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

function createMenu() {
    const list = ['Add', 'Update', 'Delete']
    const form = document.querySelector('#carForm')
    for (let i = 0; i < list.length; i++) {
        const nav = document.querySelector('#topNav')
        const ul = document.createElement('ul')
        const li = document.createElement('li')
        const h4 = document.querySelector('h4')
        h4.textContent = 'Adding'
        li.textContent = list[i]
        nav.append(ul, li)
        li.addEventListener('click', function () {
            const searchDiv = document.querySelector('.search')
            if (li.textContent === 'Add') {
                h4.textContent = 'Adding'
                searchDiv.setAttribute('hidden', 'hidden')
            } else if (li.textContent === 'Update') {
                h4.textContent = 'Updating'
                searchDiv.removeAttribute('hidden')
            } else if (li.textContent === 'Delete') {
                h4.textContent = 'Deleting'
                searchDiv.removeAttribute('hidden')
                const formData = new FormData(form)
                disableInput(formData)
            }
        })
    }
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
        .then(data => console.log(data))
};

function delCar(id) {
    
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