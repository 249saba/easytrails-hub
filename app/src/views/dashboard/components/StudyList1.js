import React from 'react'
import { Link } from 'react-router-dom'

const StudyList1 = (props) => {
  return (
    <div className='study-list-1'>
        <div className="study-name">{props.studyName}</div>
        <div className='open-btn-div'>
            <Link to="" className="study-open-btn">Open</Link>
        </div>
    </div>
  )
}

export default StudyList1