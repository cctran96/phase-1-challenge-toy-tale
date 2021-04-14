let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  // URL
  const url = 'http://localhost:3000/toys'

  // Selectors
  const addBtn = document.querySelector("#new-toy-btn")
  const toyFormContainer = document.querySelector(".container")
  const collection = document.querySelector('#toy-collection')
  const form = document.querySelector('.add-toy-form')

  // Add event listeners
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyFormContainer.style.display = "block"
    } else {
      toyFormContainer.style.display = "none"
    }
  })

  form.addEventListener('submit', handleSubmit)

  //Functions
  function getToys() {
    return fetch(url)
    .then(resp => resp.json())
    .then(data => addToys(data))
  }

  function addToys(toys) {
    toys.forEach(toy => {
      const div = document.createElement('div')
      const h2 = document.createElement('h2')
      const img = document.createElement('img')
      const p = document.createElement('p')
      const button = document.createElement('button')
  
      div.classList.add('card')
      h2.innerText = toy.name
      img.src = toy.image
      img.classList.add('toy-avatar')
      p.innerText = `${toy.likes} Likes`
      button.classList.add('like-btn')
      button.id = toy.id
      button.innerText = 'Like'
      button.addEventListener('click', handleClick)
      div.appendChild(h2)
      div.appendChild(img)
      div.appendChild(p)
      div.appendChild(button)
      collection.appendChild(div)
    })
  }

  function sendNewToy(toy) {
    const config = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toy)
    }

    return fetch(url, config)
    .then(resp => resp.json())
  }

  function handleSubmit(e) {
    e.preventDefault()

    const name = e.target.name.value
    const image = e.target.image.value
    const obj = {
      name: name,
      image: image,
      likes: 0
    }
    sendNewToy(obj)
    .then(data => addToys(data))

    e.target.reset()
  }

  function handleClick(e) {
    const button = e.target
    const card = button.closest('.card')
    const likeCountSpan = card.querySelector('p')
    const likeCount = parseInt(likeCountSpan.innerText)
    const like = {
      likes: likeCount + 1
    }

    const config = {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(like)
    }

    fetch(url + `/${button.id}`, config)
    .then(resp => resp.json())
    .then(data => {
      likeCountSpan.innerText = data.likes + ' Likes'
    })
  }

  getToys() //.then(data => addToys(data))
})