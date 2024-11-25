const knex = require("../database/knex");
const appError = require("../Utils/appError")

class NotesController {
    async create(request, response) {
        const { title, description, tags, rating } = request.body;
        const user_id = request.user.id;
    
        console.log("Corpo da requisição:", request.body);
        console.log(rating);
    
        if (!rating || !["1", "2", "3", "4", "5"].includes(rating)) {
            throw new appError("please put only valid numbers (1 to 5)");
        }

            const [note_id] = await knex("notes").insert({
                title,
                description,
                user_id,
                rating
            });
    
            const tagsInsert = tags.map(name => ({
                note_id,
                name,
                user_id
            }));
    
            await knex("tags").insert(tagsInsert);
    }
    

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first();
        const tags = await knex("tags").where({ note_id: id }).orderBy('name');


        return response.json({
            ...note,
            tags
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { title, tags } = request.query
        const user_id = request.user.id;

        let notes;

        if(tags){
           const filterTags = tags.split(',').map(tag => tag.trim());

           notes = await knex("tags")
           .select([
            "notes.id",
            "notes.title",
            "notes.user_id",
           ])
           .where("notes.user_id", user_id)
           .whereLike("notes.title", `%${title}%`)
           .whereIn("name", filterTags)
           .innerJoin("notes", "notes.id", "tags.note_id")
           .groupBy("notes.id")
           .orderBy("notes.title")

        } else {
          notes = await knex("notes").whereLike("title", `%${title}%`).where({ user_id }).orderBy("title")
        }

        const userTags = await knex("tags").where({ user_id });
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            }
        })

        return response.json(notesWithTags);
    }
}

module.exports = NotesController;