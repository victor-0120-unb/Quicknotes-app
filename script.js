
// Select the HTML elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#category-select");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

// Load saved notes from localStorage
let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];


/*
 * Save the notes array to localStorage.
 */
function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}


/*
 * Update the note count message.
 */
function updateNoteCount(numberOfNotes) {
  if (numberOfNotes === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (numberOfNotes === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${numberOfNotes} notes.`;
  }
}


/*
 * Render the notes on the page.
 *
 * createElement() and textContent are used instead
 * of innerHTML for user-provided text.
 */
function render() {
  notesList.textContent = "";

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter(function(note) {
    return note.text.toLowerCase().includes(searchTerm);
  });

  updateNoteCount(notes.length);

  if (filteredNotes.length === 0 && searchTerm !== "") {
    const emptyMessage = document.createElement("li");

    emptyMessage.textContent = "No notes match your search.";

    notesList.appendChild(emptyMessage);

    return;
  }

  if (filteredNotes.length === 0) {
    return;
  }

  filteredNotes.forEach(function(note) {

    // Create the note list item
    const noteCard = document.createElement("li");

    noteCard.classList.add("note-card");

    // Add category class
    const categoryClass = `category-${note.category.toLowerCase()}`;
    noteCard.classList.add(categoryClass);


    // Note text
    const noteText = document.createElement("p");

    noteText.classList.add("note-text");
    noteText.textContent = note.text;


    // Meta section
    const noteMeta = document.createElement("div");

    noteMeta.classList.add("note-meta");


    // Category label
    const categoryLabel = document.createElement("span");

    categoryLabel.classList.add("category-label");
    categoryLabel.textContent = note.category;


    // Date
    const dateText = document.createElement("span");

    dateText.textContent = note.createdAt;


    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";


    // Delete this specific note
    deleteButton.addEventListener("click", function() {

      notes = notes.filter(function(currentNote) {
        return currentNote.id !== note.id;
      });

      saveNotes();
      render();
    });


    // Put elements together
    noteMeta.appendChild(categoryLabel);
    noteMeta.appendChild(dateText);
    noteMeta.appendChild(deleteButton);

    noteCard.appendChild(noteText);
    noteCard.appendChild(noteMeta);

    notesList.appendChild(noteCard);
  });
}


/*
 * Add a new note.
 */
noteForm.addEventListener("submit", function(event) {

  event.preventDefault();

  const text = noteInput.value.trim();
  const category = categorySelect.value;


  // Empty note validation
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }


  // Character limit validation
  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    return;
  }


  // Valid note
  errorMessage.textContent = "";


  // Create note object
  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString()
  };


  // Add note to array
  notes.push(newNote);


  // Save and display
  saveNotes();
  render();


  // Clear input
  noteInput.value = "";
});


/*
 * Search notes whenever the user types.
 */
searchInput.addEventListener("input", function() {
  render();
});


/*
 * Clear all notes after confirmation.
 */
clearAllBtn.addEventListener("click", function() {

  const confirmed = confirm("Delete all notes?");

  if (!confirmed) {
    return;
  }

  notes = [];

  saveNotes();
  render();
});


// Display saved notes when the page first loads
render();

