import React from 'react'

const Card1 = (props) => {
    const {heading, children,flex}=props
  return (
    <div className='card-main' style={{flex:flex}}>
        <div className={`card-wrapper ${props.classes}`}  >
            <div className="card-header vector-1">{heading}</div>
            <div className="card-content">{children}</div>
        </div>
    </div>
  )
}

export default Card1