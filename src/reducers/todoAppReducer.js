var camelCase = require('lodash.camelcase');
const {
    Map,
    Record,
    List
} = require('immutable');

class Todo extends Record({
    description: null,
    completed: false
}) {
    toggle() {
        return this.set('completed', !this.completed);
    }
}

const InitialTodoApp = Record({
    newTodo: '',
    todos: List(),
    activeFilter: '',
    output: 0
});


class TodoApp extends InitialTodoApp {

    init(data) {
        return this.merge(data);
    }

    subtractinputs(action){
         console.log("subtract", JSON.stringify(action))
    }

    addinputs(action){
       console.log("add", JSON.stringify(action))
        return this.set('output', action.output);
    }

    // action methods: kind of like IBActions

    setTempTextAction({
        value
    }) {
        return this.setNewTodo(value);
    }

    removeTodoAction({
        description
    }) {
        return this.removeTodo(description);
    }

    addTodoAction() {
        return this.addTodo();
    }

    // other methods

    setNewTodo(newTodo) {
        return this.set('newTodo', newTodo);
    }

    addTodo() {
        return this.addTodoFromDescription(this.newTodo).resetNewTodo();
    }

    resetNewTodo() {
        return this.set('newTodo', '');
    }

    addTodoFromDescription(description) {
        const newTodos = this.todos.push(new Todo({
            description: description
        }));
        return this.setTodos(newTodos);
    }

    removeTodo(description) {
        const newTodos = this.todos.filter(todo => todo.description != description);
        return this.setTodos(newTodos);
    }

    setTodos(todos) {
        return this.set('todos', todos);
    }

    setTodosFromJS(todosJS) {
        const todos = todosJS.map(todoJS => new Todo(todoJS));
        return this.setTodos(todos);
    }

    incompleteTodos() {
        return this.todos.filter(todo => !todo.completed);
    }

    nIncompleteTodos() {
        return this.incompleteTodos().length;
    }

    completeTodos() {
        return this.todos.filter(todo => todo.completed);
    }

    nCompleteTodos() {
        return this.completeTodos().length;
    }

    allTodos() {
        return this.todos;
    }

    toggleTodo({
        description
    }) {
        var newTodos = this.todos.map(todo => todo.description != description ? todo : todo.toggle())
        return this.setTodos(newTodos);
    }

    describe() {
        console.log(JSON.stringify(this.toJS(), null, 4));
        console.log("incomplete todos", this.nIncompleteTodos());
    }
}

function reducerFromRecordClass(klass) {
    return function(state = new klass(), action) {
        var fn = state[camelCase(action.type)];
        if (fn) {
            return state[camelCase(action.type)](action);
        }
        else {
            if (state[camelCase(action.type)]) {
                console.warn('You tried to call an action method, but no such action method provided.', action.type)
            }
            return state;
        }

    }
}


const todoAppReducer = reducerFromRecordClass(TodoApp);

export default todoAppReducer;
