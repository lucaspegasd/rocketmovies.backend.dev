require("express-async-errors")
const cors = require("cors");

const migrationRun = require("./database/sqlite/migrations")

const appError = require("./Utils/appError");
const uploadConfig = require("./configs/Upload");
const express = require("express");

const routes = require("./routes")

migrationRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use(( error, request, response, next ) => {
    if(error instanceof appError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "internal server error"
    });
});


const port = 3001;
app.listen(port, () => console.log(`Server is running on Port ${port}`))