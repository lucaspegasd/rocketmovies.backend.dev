const { Router } = require("express");

const usersRouter = require("./user.routes");
const notesRouter = require("./note.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./session.routes");


const routes = Router();

routes.use("/users", usersRouter);
routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;