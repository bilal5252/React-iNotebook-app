import React, { useState, useContext } from 'react';
import NoteContext from "../context/notes/noteContext";


function AddNote() {
    const context = useContext(NoteContext);
    const {addNote} = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})
    const onSubmit = (e)=> {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "", tag: ""});
    }

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }
  return (
        <div>
                <h1>Add a Note</h1>
            <div className="container my-3">
            <form>
        <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" value={note.title}
            name="title" onChange={onChange} minLength={4} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" value={note.description}
            name="description" onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="tag" value={note.tag}
            name="tag" onChange={onChange} minLength={4} required/>
        </div>
        <button disabled={note.title.length < 4 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={onSubmit}>Add Note</button>
        </form>
        </div>
    </div>
  )
}

export default AddNote