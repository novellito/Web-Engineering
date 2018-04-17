import * as actionTypes from './actionTypes';

export const fetchItems = () => {
    return dispatch => {
        return  fetch(`/api/item`)
        .then(res => res.json())
        .then(data => dispatch(loadItems(data.items)))
    }
}

export const addItem = value => { // update the database and reducer
    fetch('/api/item', {
        method:'POST',
        body:JSON.stringify({item:value}),
        headers: new Headers({'Content-Type':'application/json'})
       
    }).then(res => res.json()).then(res=>console.log(res))
    return {
        type: actionTypes.ADD_ITEM,
        value
    }
}

export const deleteItem = key => { // delete the item from the database and visually

    fetch('/api/item', {
        method:'DELETE',
        body:JSON.stringify({key}),
        headers: new Headers({'Content-Type':'application/json'})
    }).then(res => res.json()).then(res=>console.log(res))

    return {
        type: actionTypes.DELETE_ITEM,
        key
    }
}

export const inputChange = value => {
    return {
        type: actionTypes.INPUT_CHANGE,
        value
    }
}

export const loadItems = items => {
    return {
        type: actionTypes.LOAD_ITEMS,
        items
    }
}

export const updatingItem = (elem,key) => {
    return {
        type: actionTypes.UPDATING_ITEM,
        elem,
        key
    }
}

export const confirmUpdate = updatedList => {
    return {
        type: actionTypes.CONFIRM_UPDATE,
        updatedList
    }
}