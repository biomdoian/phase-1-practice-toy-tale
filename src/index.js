let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn")
  const toyFormContainer = document.querySelector(".container")
  const toyCollection = document.getElementById('toy-collection')
  const newToyForm = document.querySelector('.add-toy-form');

  // Initially hide the form
  toyFormContainer.style.display = 'none';

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToyCard(toy));
      })
      .catch(error => console.error('Error fetching toys:', error))
  }

  function renderToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const nameHeading = document.createElement('h2')
    nameHeading.textContent = toy.name;

    const image = document.createElement('img')
    image.src = toy.image;
    image.alt = toy.name;
    image.className = 'toy-avatar';

    const likesParagraph = document.createElement('p')
    likesParagraph.textContent = `${toy.likes} Likes`;
    likesParagraph.id = `likes-${toy.id}`

    const likeButton = document.createElement('button')
    likeButton.className = 'like-btn';
    likeButton.id = toy.id;
    likeButton.textContent = 'Like ❤️';

    likeButton.addEventListener('click', () => handleLikeButtonClick(toy.id, toy.likes, likesParagraph));

    card.append(nameHeading, image, likesParagraph, likeButton)
    toyCollection.appendChild(card);
  }

  function handleLikeButtonClick(toyId, currentLikes, likesParagraph) {
    const newLikes = currentLikes + 1;
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        likesParagraph.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error))
  }

  newToyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = newToyForm.querySelector('input[name="name"]')
    const imageInput = newToyForm.querySelector('input[name="image"]')
    const newToyName = nameInput.value;
    const newToyImage = imageInput.value;

    if (newToyName && newToyImage) {
      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name: newToyName, image: newToyImage, likes: 0 }),
      })
        .then(response => response.json())
        .then(newToy => {
          renderToyCard(newToy);
          nameInput.value = '';
          imageInput.value = '';
          addToy = false
          addBtn.click()
        })
        .catch(error => console.error('Error adding new toy:', error))
    } else {
      alert('Please fill in both the name and image URL.')
    }
  });

  // Fetch and render initial toys when the page loads
  fetchToys();
});