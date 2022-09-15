$(document).ready(function () {
  console.log("jQuery sourced.");
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $("#submitBtn").on("click", handleSubmit);
  $("#bookShelf").on("click", ".delete-button", handleDelete);
  $("#bookShelf").on("click", ".read-button", handleRead);
  // TODO - Add code for edit & delete buttons
}

function handleDelete(event) {
  const bookid = $(event.target).closest("tr").data("bookid");

  $.ajax({
    method: "DELETE",
    url: `/books/${bookid}`,
  })
    .then((response) => {
      console.log("Deleted book at id:", bookid);
      refreshBooks();
    })
    .catch((error) => {
      console.log("error caught in delete book :>> ", error);
    });
}

function handleSubmit() {
  console.log("Submit button clicked.");
  let book = {};
  book.author = $("#author").val();
  book.title = $("#title").val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: "POST",
    url: "/books",
    data: bookToAdd,
  })
    .then(function (response) {
      console.log("Response from server.", response);
      refreshBooks();
    })
    .catch(function (error) {
      console.log("Error in POST", error);
      alert("Unable to add book at this time. Please try again later.");
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: "GET",
    url: "/books",
  })
    .then(function (response) {
      console.log(response);
      renderBooks(response);
    })
    .catch(function (error) {
      console.log("error in GET", error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $("#bookShelf").empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let bookRead = "";
    if (book.isRead) {
      bookRead = "Read";
    } else {
      bookRead = "Unread";
    }
    // For each book, append a new row to our table
    $("#bookShelf").append(`
      <tr data-bookid=${book.id}>
        <td>${bookRead}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="read-button">Read</button></td>
        <td><button class="delete-button">Delete</button></td>
      </tr>
    `);
  }
}
