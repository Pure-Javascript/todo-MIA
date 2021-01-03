(() => {
    let deadlineTimeout = null;
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    let selectedTodo = null;

    const updateTodos = () => {
        return localStorage.setItem('todos', JSON.stringify(todos));
    }

    const showDeadlineTodosDialog = () => {
        clearTimeout(deadlineTimeout);
        deadlineTimeout = null;

        document.querySelector('.dialog').style.opacity = 1;

        deadlineTimeout = setTimeout(() => {
            showDeadlineTodosDialog();
        }, 5000)
    };

    const closeDialog = () => {
        const dialog = document.querySelector('.dialog');
        const showAfterMinutes = 1;

        if (dialog.querySelector('input[name="show_after"]').checked) {
            clearTimeout(deadlineTimeout);
            deadlineTimeout = null;

            deadlineTimeout = setTimeout(() => {
                showDeadlineTodosDialog();
            }, showAfterMinutes * 60 * 1000);
        }

        dialog.style.opacity = 0;
    }

    const drawDeadlineTodosDialog = (el) => {
        const deadlineApproachTodos = todos.filter(todo => todo.deadline && todo.status != 'DONE' && todo.until - new Date() <= 60 * 60 * 24 * 1000);

        if (!todos.length || !deadlineApproachTodos.length) return;

        const fragment = document.createDocumentFragment();
        const dialog = document.createElement('div');
        const label = document.createElement('label');
        const button = document.createElement('button');

        dialog.setAttribute('class', 'dialog')
        dialog.textContent = '하루밖에 남지 않았어요!';

        deadlineApproachTodos.forEach(todo => {
            const title = document.createElement('p');

            title.setAttribute('class', 'title');
            title.innerHTML = todo.title;

            fragment.append(title);
        });

        label.innerHTML = `<input type="checkbox" name="show_after"> 1분 후 다시 보기`;

        button.textContent = '닫기';
        button.addEventListener('click', (e) => {
            closeDialog()
        });

        fragment.append(label, button);

        dialog.append(fragment);
        el.append(dialog);

        deadlineTimeout = setTimeout(() => {
            showDeadlineTodosDialog();
        }, 1000);
    }

    const editTodo = (todo) => {
        const todoList = document.querySelector('.todo');
        const title = todoList.querySelector('.title').value;
        const description = todoList.querySelector('.description').value;
        const currentTime = +new Date();
        let deadline = null;

        if (!title) return alert('제목을 입력해주세요.');

        for (const until of todoList.querySelectorAll('.deadline input[name="deadline"]')) {
            if (until.value && until.checked) deadline = until.value;
            continue;
        }

        if (todo == null) {
            const todo = {
                title: title,
                description: description,
                from: currentTime,
                until: deadline ? currentTime + (deadline * 60 * 60 * 24 * 1000) : null,
                deadline: deadline,
                status: 'TODO',
            };

            todos.unshift(todo);
        } else {
            todo.title = title;
            todo.description = description;
            todo.until = deadline ? todo.from + (deadline * 60 * 60 * 24 * 1000) : null;
            todo.deadline = deadline;

            todos.splice(todos.indexOf(todo), 1, todo);
        }

        todoList.querySelector('.todo-list').remove();

        drawTodoList(todoLayout, todos);
        updateTodos();
        clearInput();
    };

    const deleteTodo = (el, todo) => {
        el.remove();
        todos.splice(todos.indexOf(todo), 1);
        updateTodos();
    }

    const setStatus = (el, todo) => {
        let status = el.querySelector('.status');

        if (status.className.indexOf('done') === -1) {
            status.className = 'status done';
            todo.status = 'DONE';
        } else {
            status.className = 'status ready';
            todo.status = 'TODO';
        }

        updateTodos();
    }

    const drawTodoList = (el, todos) => {
        const fragment = document.createDocumentFragment();
        const todoList = document.createElement('ul');

        todoList.setAttribute('class', 'todo-list');
        todos.forEach(todo => todoList.append(createListItem(todo)));

        fragment.append(todoList);
        el.append(fragment);
    }

    const drawInputForm = (el) => {
        const fragment = document.createDocumentFragment();
        const titleInput = document.createElement('input');
        const contentInput = document.createElement('input');
        const until = document.createElement('div');
        const buttonSave = document.createElement('button');
        const buttonCancel = document.createElement('button');

        titleInput.setAttribute('class', 'title');
        titleInput.setAttribute('type', 'text');
        titleInput.setAttribute('placeholder', '제목을 입력하세요');

        contentInput.setAttribute('class', 'description');
        contentInput.setAttribute('type', 'text');
        contentInput.setAttribute('placeholder', '내용을 입력하세요');

        until.setAttribute('class', 'deadline');
        until.innerHTML = `
            <label><input type="radio" name="deadline" value="">설정안함</label>
			<label><input type="radio" name="deadline" value="1">1일 후</label>
			<label><input type="radio" name="deadline" value="7">7일 후</label>
			<label><input type="radio" name="deadline" value="30">30일 후</label>
        `;

        buttonSave.setAttribute('class', 'save-btn');
        buttonSave.textContent = '입력';
        buttonSave.addEventListener('click', (e) => editTodo(selectedTodo));

        buttonCancel.textContent = '취소';
        buttonCancel.addEventListener('click', (e) => clearInput());

        fragment.append(titleInput, contentInput, until, buttonSave, buttonCancel);
        el.append(fragment);
    }

    const createListItem = (todo) => {
        const fragment = document.createDocumentFragment();
        const li = document.createElement('li');
        const content = document.createElement('div');
        const status = document.createElement('span');
        const until = document.createElement('span');
        const button = document.createElement('button');

        li.setAttribute('class', 'item');

        content.setAttribute('class', 'content');
        content.innerHTML = `
			<h1 class="title">${todo.title}</h1>
			<p class="description">${todo.description}</p>
        `;

        if (todo.deadline) {
            const until = new Date(todo.until);
            content.innerHTML += `<span class="until">${until.getMonth() + 1}월 ${until.getDate()}일까지</span>`;
        }

        status.setAttribute('class', `status ${todo.status == 'TODO' ? 'ready' : 'done'}`);
        status.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"/></svg>`;

        button.setAttribute('class', 'delete-btn');
        button.textContent = '삭제';

        content.addEventListener('click', (e) => {
            document.querySelector('.todo > .title').value = todo.title;
            document.querySelector('.todo > .description').value = todo.description;
            for (const until of document.querySelectorAll('.todo > .deadline input[name="deadline"]')) {
                if (until.value == todo.deadline) until.checked = true;
                continue;
            }

            selectedTodo = todo;
        });

        status.addEventListener('click', (e) => setStatus(li, todo));
        button.addEventListener('click', (e) => deleteTodo(li, todo));

        li.append(content, status, until, button);

        return fragment.appendChild(li);
    }

    const clearInput = () => {
        const todoList = document.querySelector('.todo');

        todoList.querySelector('.title').value = '';
        todoList.querySelector('.description').value = '';

        for (const until of document.querySelectorAll('.todo > .deadline input[name="deadline"]')) {
            until.checked = false;
        }

        selectedTodo = null;
    }


    const todoLayout = document.createElement('div');

    todoLayout.setAttribute('class', 'todo');

    drawInputForm(todoLayout);
    drawTodoList(todoLayout, todos);
    drawDeadlineTodosDialog(todoLayout);

    document.body.append(todoLayout);
})();