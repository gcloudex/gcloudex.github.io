// Ref: https://www.youtube.com/watch?v=0bec1BmeY4c&t=33s

function createNode(element)
{
  return document.createElement(element);
}

function append(parent, el)
{
  return parent.appendChild(el);
}

const ul = document.getElementById("authorlist");
const url = "https://randomuser.me/api/?results=50";

fetch(url)
.then((resp) => resp.json())
.then(function(resp){
  let authors = resp.results;
  return authors.map(function(author){
    let li = createNode("li"),
    img = createNode("img"),
    span = createNode("span");

    img.src = author.picture.medium;
    span.innerHTML = `&nbsp; ${author.name.first} ${author.name.last}`

    append(li, img);
    append(li, span);
    append(ul, li);
  })
})
.catch(function(error){
  console.log(JSON.stringify(error));
})