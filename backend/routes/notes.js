const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');



// Route 1: get all the notes GET '/api/notes/fetchallnotes' login require
router.get('/fetchallnotes', fetchuser, async (req, res)=> {
    try{
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)

    } catch(error){
        console.log(error.message);
        res.status(500).send("Interna server error")
    }
})

// Route 2: add a new notes using POST '/api/notes/addnote' login require
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({min: 3}),
    body('description', 'description atleast 5 character').isLength({min: 5})
], async (req, res)=> {
    try {
        const {title, description, tag} = req.body;
        // tf there are errors return badrequest and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        // create a note
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote)

    } catch(error) {
        console.log(error.message);
        res.status(500).send("Interna server error")
    }
    
})

// Route 3: update existing notes using PUT '/api/notes/updatenote' login require
router.put('/updatenote/:id', fetchuser, async (req, res)=> {
    const {title, description, tag} = req.body;
    try {
    // create a new note object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // find the note to be upadeted and update it
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found")
    }

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});

} catch(error) {
    console.log(error.message);
    res.status(500).send("Interna server error")
}

})


// Route 4: delete existing notes using POST '/api/notes/deletenote' login require
router.delete('/deletenote/:id', fetchuser, async (req, res)=> {
    try {
    // find the note to be delete and delete it
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found")
    }

    // allow delete if user is own this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted", note: note});

} catch(error) {
    console.log(error.message);
    res.status(500).send("Interna server error")
}

})


module.exports = router