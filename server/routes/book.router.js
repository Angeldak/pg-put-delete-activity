const express = require("express");
const router = express.Router();

const pool = require("../modules/pool");

// Get all books
router.get("/", (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool
    .query(queryText)
    .then((result) => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error getting books", error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post("/", (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;

  if (!req.body.author || !req.body.title) return res.sendStatus(400);

  pool
    .query(queryText, [newBook.author, newBook.title])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put("/:bookid", (req, res) => {
  const bookid = req.params.bookid;
  const newRead = req.body.isRead;
  const queryText = `UPDATE "books" SET "isRead"=$1 WHERE "id"=$2`;
  pool
    .query(queryText, [newRead, bookid])
    .then((response) => {
      res.sendStatus(200);
      console.log("Updating book information");
    })
    .catch((error) => {
      console.log("error caught in book put :>> ", error);
      res.sendStatus(500);
    });
});

router.put("/:bookid/edit", (req, res) => {
  const bookid = req.params.bookid;
  const updateInfo = req.body;
  const queryText = `UPDATE "books" SET "author"=$1, "title"=$2 WHERE "id"=$3`;

  // Checks if author and title are falsy for validation
  if (!req.body.author || !req.body.title) return res.sendStatus(400);

  pool
    .query(queryText, [updateInfo.author, updateInfo.title, bookid])
    .then((response) => {
      res.sendStatus(200);
      console.log("Updating book information");
    })
    .catch((error) => {
      console.log("error caught in book put :>> ", error);
      res.sendStatus(500);
    });
});
// TODO - DELETE
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete("/:bookid", (req, res) => {
  const bookid = req.params.bookid;
  const queryText = `DELETE FROM "books" WHERE "id"=$1`;

  pool
    .query(queryText, [bookid])
    .then(() => {
      console.log("Deleting book at id:", bookid);
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("error in book delete :>> ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
