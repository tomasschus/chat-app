const socket = io();

let output = document.getElementById("output");
var message = document.getElementById("message");
//let username = document.getElementById("username");
let btnSend = document.getElementById("send");
let actions = document.getElementById("actions");
let username = localStorage.getItem("username");


while (username === null || username === "") {
    username = prompt("¿Como te llamas? escribilo bien, tenes 1 oportunidad")
    localStorage.setItem("username", username)
}

function scrollButton(){
    $('#message').scrollTop( $('#message')[0].scrollHeight );
}

function union(){
    var date = new Date();
    var fecha = date.getDate() + '-' + ( date.getMonth() + 1 ) + '-' + date.getFullYear() +" " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    console.log(localStorage.getItem("username"))
    socket.emit("chat:union", {"username":username, "date":fecha})
}
union();

btnSend.addEventListener("click", () => {
    var date = new Date();
    var fecha = date.getDate() + '-' + ( date.getMonth() + 1 ) + '-' + date.getFullYear() +" " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    socket.emit('chat:message', { "username": username, "message": message.value, "date": fecha })
    message.value = ""
    message.focus();
    scrollButton();
})

message.addEventListener("keypress", () => {
    socket.emit("user:typing", username)
})

socket.on("user:typing", (user) => {
    console.log("typping" + user)
    accions.innerHTML = `<p> <em>${user} esta escribiendo...</em>  </p>`
    setTimeout(function () { accions.innerHTML = "" }, 2000);
})

socket.on("chat:message", (message) => {
    //output.innerHTML = `<p> <strong>${message.username}:</strong>  ${message.message} </p> ` + output.innerHTML
    if (message.username !== username) {
        output.innerHTML = `<ul class="p-0">
        <li>
            <div class="row comments mb-2">
                <div class="col-md-2 col-sm-2 col-3 text-center user-img">
                    <img id="profile-photo" src="/img/user1.png"
                        class="rounded-circle" />
                </div>
                <div class="col-md-9 col-sm-9 col-9 comment rounded mb-2">
                    <h4 class="m-0"><a href="#">${message.username}</a></h4>
                    <time class="text-white ml-3">${message.date}</time>
                    <like></like>
                    <p class="mb-0 text-white">${message.message}</p>
                </div>
            </div>
        </li>
    </ul>` + output.innerHTML;
    }
    else {
        output.innerHTML = `<ul class="p-0">
        <li>
            <div class="row comments mb-2">
                <div
                    class="col-md-2 offset-md-2 col-sm-2 offset-sm-2 col-3 offset-1 text-center user-img">
                    <img id="profile-photo" src="/img/user2.png"
                        class="rounded-circle" />
                </div>
                <div class="col-md-7 col-sm-7 col-8 comment rounded mb-2">
                    <h4 class="m-0"><a href="#">${message.username}</a></h4>
                    <time class="text-white ml-3">${message.date}</time>
                    <like></like>
                    <p class="mb-0 text-white">${message.message}</p>
                </div>
            </div>
        </li>
    </ul>` + output.innerHTML;
    }
})

socket.on("chat:union", (data) => {
    output.innerHTML = `<ul class="p-0">
        <li>
            <div class="row comments mb-2">
                <div class="col-md-2 col-sm-2 col-3 text-center user-img">
                    <img id="profile-photo" src="/img/admin.png"
                        class="rounded-circle" />
                </div>
                <div class="col-md-9 col-sm-9 col-9 comment rounded mb-2">
                    <h4 class="m-0"><a href="#">ADMINISTRADOR</a></h4>
                    <time class="text-white ml-3">${data.date}</time>
                    <like></like>
                    <p class="mb-0 text-white">${data.username} ha entrado al chat.</p>
                </div>
            </div>
        </li>
    </ul>` + output.innerHTML;
})

socket.on("chat:allmessages", (messages) => {
    console.log(messages)
    messages.forEach(message => {
        if (message.username !== username) {
            output.innerHTML = `<ul class="p-0">
            <li>
                <div class="row comments mb-2">
                    <div class="col-md-2 col-sm-2 col-3 text-center user-img">
                        <img id="profile-photo" src="/img/user1.png"
                            class="rounded-circle" />
                    </div>
                    <div class="col-md-9 col-sm-9 col-9 comment rounded mb-2">
                        <h4 class="m-0"><a href="#">${message.username}</a></h4>
                        <time class="text-white ml-3">${message.date}</time>
                        <like></like>
                        <p class="mb-0 text-white">${message.message}</p>
                    </div>
                </div>
            </li>
        </ul>` + output.innerHTML;
        }
        else {
            output.innerHTML = `<ul class="p-0">
            <li>
                <div class="row comments mb-2">
                    <div
                        class="col-md-2 offset-md-2 col-sm-2 offset-sm-2 col-3 offset-1 text-center user-img">
                        <img id="profile-photo" src="/img/user2.png"
                            class="rounded-circle" />
                    </div>
                    <div class="col-md-7 col-sm-7 col-8 comment rounded mb-2">
                        <h4 class="m-0"><a href="#">${message.username}</a></h4>
                        <time class="text-white ml-3">${message.date}</time>
                        <like></like>
                        <p class="mb-0 text-white">${message.message}</p>
                    </div>
                </div>
            </li>
        </ul>` + output.innerHTML;
        }
    });


})

Vue.component('like', {
    template: "<div class='like-data float-right text-white'><button class='icon-rocknroll mr-1 p-0 border-0' v-class='active: liked' v-on='click: toggleLike'><i class='fa fa-thumbs-up text-white' aria-hidden='true'></i></button><span class='like-count' v-class='active: liked'>{{ likesCount }}</span></div>",
    data: function () {
        return {
            liked: false,
            likesCount: 0
        }
    },
    methods: {
        toggleLike: function () {
            this.liked = !this.liked;
            this.liked ? this.likesCount++ : this.likesCount--;
        }
    }
});
new Vue({
    el: '.comments-main',
});

