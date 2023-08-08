const notesRouter = require('express').Router()

const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })

})

notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note){
                response.json(note)
            }else{
                response.status(404).end()
            }
        })

    notesRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
    })
})

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

notesRouter.put('/:id',(request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(request.params.id,
        { content, important },
        { new : true , runValidators: true, context: 'query' })
        .then(
            updatedNote => {
                response.json(updatedNote)
            })
        .catch(error => next(error))

})


module.exports = notesRouter;