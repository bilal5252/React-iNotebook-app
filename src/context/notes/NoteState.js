import { useState } from "react";
import NoteContext from "./noteContext";

const NoteSate = (props)=> {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  // fetch all notes
  // Add a Note
  const fetchAllNotes = async()=> {
    // API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json =  await response.json();
    setNotes(json)
  }

      // Add a Note
      const addNote = async(title, description, tag)=> {
        //TODO API call
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        // ya to neeche ka logic likho ya ye api call do
        // fetchAllNotes();

        setNotes(notes.concat(json));
        props.showAlert("Note added successfully!!", "success");
      }


      // Delete a Note
      const deleteNote = async(id)=> {
        // TODO API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
        const json =  response.json();
        console.log(json)
        fetchAllNotes();
        props.showAlert("Note deleted successfully!!", "success");
      }

      // Edit a Note
      const editNote = async(id, title, description, tag)=> {
        // API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag})
        });
        const json =  await response.json();
        console.log(json)
        // ya to neeche ka logic likho ya ye api call do
        // fetchAllNotes();

        // new logic to update current note
        let newNotes = JSON.parse(JSON.stringify(notes))
        for(let i = 0; i < newNotes.length; i++){
          const element = newNotes[i];
          if(element._id === id) {
            newNotes[i].title = title;
            newNotes[i].description = description;
            newNotes[i].tag = tag;
            break;
          }
        }
        setNotes(newNotes)
        props.showAlert("Updated successfully!!", "success");
      }

    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, fetchAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}


export default NoteSate;