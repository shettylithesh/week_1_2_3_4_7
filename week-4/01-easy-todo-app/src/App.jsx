import {useEffect, useRef, useState} from 'react'
import './App.css'
import axios from "axios";


const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000
});
//custom hook
function useTodos(){
    const [todos, setTodos] = useState([])
    // fetch all todos from server
    useEffect(() => {
        axiosInstance.get("/todos").then((response)=>{
            let todos = response.data
            console.log(todos);
            setTodos(todos);
        }).catch((err)=>{console.log(err)});

        //fetch todos every sec
        setInterval(()=>{
            axiosInstance.get("/todos").then((response)=> {
                let todos = response.data
                console.log(todos);
                setTodos(todos);
            });
        },1000)
    }, []);


    return todos;
}

function App() {
    let todos = useTodos();
    console.log(todos);

    //event handling new todo insertion
    const inputRef = useRef(null);

    function addTodo(){
        // Access the input value using the ref
        const inputValue = inputRef.current.value;
        let todo = {"title" : inputValue}
        axiosInstance.post("/todos", todo).then(()=>{

        })
    }

    return (
        <>
            <div>
                <h1>Easy Todo App</h1>
                <input type="text"
                       ref={inputRef}
                />
                <button onClick={addTodo}>Add Todo</button>
                {todos.map(todo => {
                    return <Todo key={todo.id} title={todo.title} description={todo.description} id = {todo.id}></Todo>
                })}
            </div>
        </>
    )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    let todoId = props.id;
    // console.log(todoId)
    function deleteTodo(){
        console.log(todoId)
       axiosInstance.delete("/todos/" + todoId)
    }
    return <div>
        {props.title}
        &nbsp;
        {props.description}
        &nbsp;
        <button onClick={deleteTodo}>Delete</button>
    <br/>
    </div>
}

export default App
