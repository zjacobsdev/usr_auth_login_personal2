
// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("trash");
const name =document.querySelector('[name="name"]')

// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const q = this.parentNode.childNodes[1].innerText
        const a = this.parentNode.childNodes[2].innerText
        fetch('diary', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
             'name': name,
             'q': q,
             'a': a
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
