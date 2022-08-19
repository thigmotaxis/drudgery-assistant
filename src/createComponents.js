export default function createElement(tag, classes, parent) {
  const element = document.createElement(tag)
  for(let i = 0; i < classes.length; i++) {
    element.classList.add(classes)
  }
  parent.appendChild(element)
  return element
}
