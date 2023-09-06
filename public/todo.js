function onCheckboxClick(event) {
    var checked = event.target.checked;
    var id = event.target.parentNode.id;
    var listText = event.target.parentNode.querySelector('.list__text');
    if (checked === true) {
        axios.put(`http://localhost:3000/todos/${id}?user=1`, {
            done: 1,
        }).then(() => {
            listText.style.textDecoration = 'line-through';
            listText.contentEditable = false;
        }).catch(() => {
            event.target.checked = false;
        });
    } else {
        axios.put(`http://localhost:3000/todos/${id}?user=1`, {
            done: 0,
        }).then(() => {
            listText.style.textDecoration = 'none';
            listText.contentEditable = true;
        }).catch(() => {
            event.target.checked = true;
        }); 
    }
}

function onDeleteButton(event) {
    var text = event.target.parentNode.querySelector('.list__text').innerText;
    var id = event.target.parentNode.id;
    var confirmed = window.confirm(`¿Estás seguro que deseas eliminar ${text}?`);
    if (confirmed) {
        axios.delete(`http://localhost:3000/todos/${id}?user=1`).then(() => {
            event.target.parentNode.remove();
        }).catch(() => {
            alert('No se pudo eliminar la tarea');
        });
    }
}

function onBlurText(event, texts) {
    var id = event.target.parentNode.id;
    var newText = event.target.innerText;

    if (texts.get(id) !== newText) {
        if (id === 'new') {
            axios.post(`http://localhost:3000/todos?user=1`, {
                description: newText,
            }).then(results => {
                texts.delete(id);
                texts.set(results.data.id, results.data.description);
                event.target.parentNode.id = results.data.id;
            });
        } else {
            axios.put(`http://localhost:3000/todos/${id}?user=1`, {
                description: newText,
            });
            texts.delete(id);
            texts.set(id, newText);
        }
    }
}

function createTask(id, text, done) {
    var li = document.createElement('li');
    var checkbox = document.createElement('input');
    var div = document.createElement('div');
    var texto = document.createTextNode(text);
    var deleteButton = document.createElement('input');

    li.className = 'list__item';
    li.id = id;
    checkbox.type = 'checkbox';
    checkbox.className = 'item-checkbox';
    checkbox.addEventListener('click', onCheckboxClick);
    deleteButton.type = 'button';
    deleteButton.value = '🗑️';
    deleteButton.className = 'item-delete-button';
    deleteButton.addEventListener('click', onDeleteButton);
    div.className = 'list__text';

    if (done === 1) {
        checkbox.checked = true;
        div.style.textDecoration = 'line-through';
    } else {
        div.contentEditable = true;
    }

    div.appendChild(texto);
    li.appendChild(checkbox);
    li.appendChild(div);
    li.appendChild(deleteButton);

    return li;
}

window.onload = () => {
    var texts = new Map();
    var checkboxs = document.querySelectorAll('.list__item > .item-checkbox');
    var deleteButtons = document.querySelectorAll('.list__item > .item-delete-button');
    var addTask = document.querySelector('.container__add-task > .add-task');
    var list = document.querySelector('.list');

    axios.get('http://localhost:3000/todos?user=1').then(respuesta => {
        respuesta.data.results.map(task => {
            var taskDOM = createTask(task.id, task.description, task.done);
            texts.set(`${task.id}`, task.description);
            list.appendChild(taskDOM);
        });
        var listTexts = document.querySelectorAll('.list__text');
        listTexts.forEach(listText => {
            listText.addEventListener('blur', (event) => onBlurText(event, texts));
        });
    });

    addTask.addEventListener('click', () => {
        var defaultText = 'Nueva tarea';
        var task = document.querySelector('#new');
        if (task === null) {
            var newTask = createTask('new', defaultText, 0);
            texts.set('new', defaultText);
            newTask.querySelector('.list__text').addEventListener('blur', (event) => onBlurText(event, texts));
            list.appendChild(newTask);
        }
    });
}
