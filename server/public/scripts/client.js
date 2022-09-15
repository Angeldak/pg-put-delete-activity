$(document).ready(function () {
  console.log("jQuery sourced.");
  refreshBooks();
  addClickHandlers();
});

// Initiate "edit mode" items on page load
let editMode = false;
let editID = "";

function addClickHandlers() {
  $("#submitBtn").on("click", handleSubmit);
  $("#bookShelf").on("click", ".delete-button", handleDelete);
  $("#bookShelf").on("click", ".read-button", handleRead);
  $("#bookShelf").on("click", ".edit-button", handleEdit);
  $("#cancelBtn").on("click", handleCancel);
  // TODO - Add code for edit & delete buttons
}

function handleCancel() {
  // Reset edit mode to default page mode and refresh books to newest data and resets globalid
  editMode = false;
  editID = "";
  refreshBooks();
  $("#author").val("");
  $("#title").val("");
} // end handleCancel

function handleEdit(event) {
  // Handle changing the browser to edit mode when edit is clicked
  // Stores currentshoe id into global variable for sure
  editID = $(event.target).closest("tr").data("bookid");
  editMode = true;
  // Pulls in the title and author from the DOM
  $("#author").val(
    $($(event.target).closest("tr").children().siblings()[2]).text()
  );
  $("#title").val(
    $($(event.target).closest("tr").children().siblings()[1]).text()
  );
  refreshBooks();
} // end handleEdit

function handleDelete(event) {
  // Handles deleting a book when delete is clicked
  const bookid = $(event.target).closest("tr").data("bookid");

  $.ajax({
    method: "DELETE",
    url: `/books/${bookid}`,
  })
    .then((result) => {
      console.log("Deleted book at id:", bookid);
      refreshBooks();
    })
    .catch((error) => {
      console.log("error caught in delete book :>> ", error);
    });
} // end handleDelete

function handleRead(event) {
  // Handles switching a book to read or unread when clicked
  const bookid = $(event.target).closest("tr").data("bookid");
  let readYet = $($(event.target).parent().siblings()[0]).text();

  // Checks if the current book on the DOM shows Unread
  if (readYet === "Unread") {
    readYet = true;
  } else {
    readYet = false;
  }

  $.ajax({
    method: "PUT",
    url: `/books/${bookid}`,
    data: {
      isRead: `${readYet}`,
    },
  })
    .then((result) => {
      console.log("Updating isRead to:", readYet);
      refreshBooks();
    })
    .catch((error) => {
      console.log("error caught in update read :>> ", error);
    });
} // end handleRead

function handleSubmit() {
  // console.log("Submit button clicked."); //Commenting to remove console spam
  let book = {};
  book.author = $("#author").val();
  book.title = $("#title").val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  // Checks if in edit mode and runs PUT with input info
  if (editMode === true) {
    $.ajax({
      type: "PUT",
      url: `/books/${editID}/edit`,
      data: bookToAdd,
    })
      .then(function (response) {
        console.log("Response from server.", response);
        handleCancel();
      })
      .catch(function (error) {
        console.log("Error in POST", error);
        alert("Unable to add book at this time. Please try again later.");
      });
  } else {
    // Runs POST with input info if NOT in edit mode
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
} // end addBook

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: "GET",
    url: "/books",
  })
    .then(function (response) {
      // console.log(response);  Removing to stop spam in console
      if (editMode === true) {
        $("#addEditBook").text("Edit Current Book");
        $(".cancel-controls").show();
      } else {
        $("#addEditBook").text("Add New Book");
        $(".cancel-controls").hide();
      }
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
    // Checks if database shows current book is read and puts it on the DOM
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
        <td><button class="read-button">Read/Unread</button></td>
        <td><button class="edit-button">Edit</button></td>
        <td><button class="delete-button">Delete</button></td>
      </tr>
    `);
  }
}
