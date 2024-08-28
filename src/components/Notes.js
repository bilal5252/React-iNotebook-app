import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom'


function Notes(props) {
    const context = useContext(NoteContext);
    const {notes, fetchAllNotes, editNote} = context;
    const [note, setNote] = useState({id: "", etitle: "", edescription: "", etag: ""})
    let navigate = useNavigate()

    useEffect(()=> {
      if(localStorage.getItem('token')){
        fetchAllNotes();
      } else {
        navigate("/login")
      }
      // eslint-disable-next-line
    }, [])
    const ref = useRef(null);
    const refClose = useRef(null)


    const updateNote = (currentNote)=> {
      ref.current.click();
      setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
    }

    const onUpdate = (e)=> {
      console.log('updated', note)
      editNote(note.id, note.etitle, note.edescription, note.etag);
      ref.current.click();
    }

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }
  return (
    <>
    {/* we use addNote component here */}
    <AddNote showAlert={props.showAlert}/>
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

            <form>
              <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" 
                  name="etitle" value={note.etitle} onChange={onChange} minLength={4} required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" 
                  name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag"
                   value={note.etag} onChange={onChange} minLength={4} required/>
              </div>
              </form>

            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 4 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={onUpdate}>Update Note</button>
            </div>
          </div>
        </div>
      </div>

    <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
        {notes.length===0 && 'Not notes to display!!'}</div>
        {notes.map((note)=>{
          // we use note item component here 
        return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note}/>
        })}
    </div>
    </>
  )
}

export default Notes