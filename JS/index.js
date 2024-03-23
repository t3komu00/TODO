const BACKEND_ROOT_URL = 'http://localhost:3001';
//const BACKEND_ROOT_URL = 'https://todo-backend-3d5g.onrender.com';
import {Todos} from './class/Todos.js';

const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('ul');
const input = document.querySelector('input');
input.disabled = true;

const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'List-group-item');
    li.setAttribute('data-key', task.getId());
    li.innerHTML = task.getText();
    renderSpan(li, task.getText());
    renderLink(li, task.getId());
    list.appendChild(li);
}

const renderSpan = (li, text) => {
    const span = document.createElement('span');
    span.innerHTML = text;
}

const renderLink = (li, id) => {
    const a = li.appendChild(document.createElement('a'));
    a.innerHTML = '<i class="bi bi-trash"></i>';
    a.setAttribute('style', 'float:right');
    a.addEventListener('click', (event)=>{
        todos.removeTask(id).then((remove_id)=>{
            const li_to_remove = document.querySelector(`[data-key="${remove_id}"]`);
            if(li_to_remove){
                list.removeChild(li_to_remove);
            }
        }).catch((error)=>{
            alert(error)
        })
    })
}

const getTasks = () => {
    todos.getTasks().then((tasks)=>{
        tasks.forEach(task => {
            renderTask(task);
        })
        input.disabled = false;
    }).catch((error)=>{
        alert(error)
    })
}
        

const saveTask = async (task) => {
    try{
        const json = JSON.stringify({description: task});
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });
        return response.json();
        }catch(error){
            alert('Error saving task: '+ error.message);
        }
    
    }

input.addEventListener('keypress', (event)=>{
    if(event.key === 'Enter'){
        event.preventDefault();
        const task = input.value.trim();
        if(task !== '') {
            todos.addTask(task).then((task)=>{  
                renderTask(task);
                input.value = '';
                input.focus();
            })
        }
    }
})
           
          
getTasks();