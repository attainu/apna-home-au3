import React from 'react'

export const Input = (props) => {

    return (
        <div className="form-group mb-0 pb-0">
            <input className="form-control" type={props.type} onChange={props.changeHandler} value={props.value} name={props.name}/>        
        </div>
    )
}
