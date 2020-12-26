(() => {
	let todos = [];
	let selectedTodo = null;

	const getTodoList = () => {
		return localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')): [];
	};

	const editTodo = (todo) => {
		const todoList = document.querySelector('.todo');
		// @TODO validation

		if (todo == null) {
			const todo = {
				id: null,
				title: todoList.querySelector('.title').value,
				description: todoList.querySelector('.description').value,
				until: null,
				status: 'TODO',
				seq: 0
			};

			todos.unshift(todo);
		} else {
			const todo = selectedTodo;

			todo.title = todoList.querySelector('.title').value;
			todo.description = todoList.querySelector('.description').value;
			todos.splice(todos.indexOf(todo), 1, todo);

			selectedTodo = null;
		}

		localStorage.setItem('todos', JSON.stringify(todos));
		todoList.querySelector('.todo-list').remove();
		drawTodoList(todoListForm, todos);
		clearInput();
	};

	const deleteTodo = (el, todo) => {
		el.remove();
		todos.splice(todos.indexOf(todo), 1);
		console.log(todos);
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

		console.log(todos);
	}

	// todo list를 그림
	const drawTodoList = (el, todos) => {
		const fragment = document.createDocumentFragment();
		const ul = document.createElement('ul');
		
		ul.setAttribute('class', 'todo-list');
		
		todos.forEach(todo => ul.append(createListItem(todo)));

		fragment.append(ul);
		el.append(fragment);
	}

	const drawInputForm = (el) => {
		const fragment = document.createDocumentFragment();

		const titleInput = document.createElement('input');
		titleInput.setAttribute('class', 'title');
		titleInput.setAttribute('type', 'text');
		titleInput.setAttribute('placeholder', '제목을 입력하세요');
		titleInput.addEventListener('keyup', (e) => {
			title = e.target.value;
		});

		const contentInput = document.createElement('input');
		contentInput.setAttribute('class', 'description');
		contentInput.setAttribute('type', 'text');
		contentInput.setAttribute('placeholder', '내용을 입력하세요');
		contentInput.addEventListener('keyup', (e) => {
			content = e.target.value;
		});
		
		const button = document.createElement('button');
		button.textContent = '입력';
		button.addEventListener('click', (e) => editTodo(selectedTodo));

		const buttonCancel = document.createElement('button');
		buttonCancel.textContent = '취소';
		buttonCancel.addEventListener('click', (e) => clearInput());

		fragment.append(titleInput, contentInput, button, buttonCancel);
		el.append(fragment);
	}

	const createListItem = (todo) => {
		const fragment = document.createDocumentFragment();
		const li = document.createElement('li');
		const content = document.createElement('div');
		const status = document.createElement('span');
		const button = document.createElement('button');

		li.setAttribute('class', 'item');
		
		content.setAttribute('class', 'content');
		content.addEventListener('click', (e) => {
			document.querySelector('.todo > .title').value = todo.title;
			document.querySelector('.todo > .description').value = todo.description;
			selectedTodo = todo;
		});
		content.innerHTML = `
			<h1 class="title">${todo.title}</h1>
			<p class="description">${todo.description}</p>
		`;

		status.setAttribute('class', 'status ready');
		status.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"/></svg>`;
		status.addEventListener('click', (e) => setStatus(li, todo));

		button.setAttribute('class', 'delete-btn');
		button.textContent = '삭제';
		button.addEventListener('click', (e) => deleteTodo(li, todo));

		li.append(content, status, button);
		
		return fragment.appendChild(li);
	}

	const clearInput = () => {
		const todoList = document.querySelector('.todo');

		todoList.querySelector('.title').value = '';
		todoList.querySelector('.description').value = '';
	}

	todos = getTodoList();
	
	const todoListForm = document.createElement('div');
	todoListForm.setAttribute('class', 'todo');

	drawInputForm(todoListForm);
	drawTodoList(todoListForm, todos);

	document.body.append(todoListForm);
})();