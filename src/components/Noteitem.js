import React, {useContext} from 'react'
import NoteContext from "../context/notes/noteContext";

function Noteitem(props) {
    const {note, updateNote} = props;
    const context = useContext(NoteContext);
    const {deleteNote} = context;
  return (
    <div className="col-md-3">
        <div className="card my-3">
        <h5 className="card-header">{note.tag}</h5>
        <div className="card-body">
            <div className="d-flex align-item-center">
            <h6 className="card-title">{note.title}</h6>
            </div>
            <p className="card-text">{note.description}</p>
            <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id)}}></i>
            <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
        </div>
        </div>
    </div>
  )
}

export default Noteitem