/**
 * Created by Andrei on 10/4/2016.
 */

import { createStore, combineReducers } from 'redux';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false,
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed,
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action),
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const todosApp = combineReducers({
    todos,
    visibilityFilter,
});

const store = createStore(todosApp);

const getVisibleTodos = (items, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return items;
        case 'SHOW_ACTIVE':
            return items.filter(item => !item.completed);
        case 'SHOW_COMPLETED':
            return items.filter(item => item.completed);
        default:
            return items;
    }
};

const Todo = ({
    onClick,
    text,
    completed,
}) => (
    <li
        onClick={onClick}
        style={{
            textDecoration: completed ?
                'line-through' :
                'none',
            cursor: 'pointer',
        }}
    >
        {text}
    </li>
);

const TodoList = ({
    onTodoClick,
    todos,
}) => (
    <ul>
        {todos.map(item =>
            <Todo
                key={item.id}
                {...item}
                onClick={() => onTodoClick(item.id)}
            />
        )}
    </ul>
);

const FilterLink = ({
    filter,
    currentFilter,
    children,
}) => {
    if (filter === currentFilter) {
        return <span>{children}</span>;
    }
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter,
                });
            }}
        >
            {children}
        </a>
    );
};

let nextTodoId = 0;
class TodoApp extends Component {
    render() {
        const {
            todos,
            visibilityFilter,
        } = this.props;
        const visibleTodos = getVisibleTodos(
            todos,
            visibilityFilter
        );

        return (
            <div>
                <h1>Todos List App</h1>
                <input ref={node => (this.input = node)} />
                <button
                    onClick={() => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            id: nextTodoId++,
                            text: this.input.value,
                        });
                        this.input.value = '';
                    }}
                >
                    Add New
                </button>
                <TodoList
                    todos={visibleTodos}
                    onTodoClick={id =>
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id,
                        })
                    }
                />
                <p>Show:
                    {' '}
                    <FilterLink
                        filter="SHOW_ALL"
                        currentFilter={visibilityFilter}
                    >
                        All
                    </FilterLink>
                    {' '}
                    <FilterLink
                        filter="SHOW_ACTIVE"
                        currentFilter={visibilityFilter}
                    >
                        Active
                    </FilterLink>
                    {' '}
                    <FilterLink
                        filter="SHOW_COMPLETED"
                        currentFilter={visibilityFilter}
                    >
                        Completed
                    </FilterLink>
                </p>
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp
            {...store.getState()}
        />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();


const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux',
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false,
        },
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false,
        },
        {
            id: 1,
            text: 'Eat fresh',
            completed: false,
        },
    ];
    const action = {
        type: 'TOGGLE_TODO',
        id: 1,
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false,
        },
        {
            id: 1,
            text: 'Eat fresh',
            completed: true,
        },
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
// console.log('All tests passed!');
