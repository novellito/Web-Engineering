import React from 'react';
import './Todo.css';

const Todo = () => {
          const thinking =  <i className="em em-thinking_face"></i>;
          let disabled = false;
    return (
        <div>
            <h1 className="article-title">Paper To Do App</h1>
            <span className="article-meta">By Christian T. {thinking}</span>
            <h3>My List</h3>

            <div className="row">
                <div className="flex-list">
                    <ul>
                        <li> 
                            <button className="btn-danger btn-small"><i className="em em-x"></i></button>
                            <p className="item">item1</p>
                        </li>
                        <li> 
                            <button className="btn-danger btn-small"><i className="em em-x"></i></button>
                            <p className="item">item1</p>
                        </li>
                        <li> 
                            <button className="btn-danger btn-small"><i className="em em-x"></i></button>
                            <p className="item">item1</p>
                        </li>
                        <li> 
                            <button className="btn-danger btn-small"><i className="em em-x"></i></button>
                            <p className="item">item1</p>
                        </li>
                     
                    </ul>
                </div>
            </div>


            <div className="row">
                <div className="input-flex-container">
                    <input type="text" placeholder="what to do... " />
                    <button type="button" className={disabled===true?"btn-secondary disabled":'btn-secondary'}>Add</button>
                </div>
            </div>

        </div>
    )
}

export default Todo;