const socket = io()

//OPTIONS
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

//CHAT-TEMPLATES
const $chatMsg = document.querySelector('.msgChat')
const $msgTemplate = document.querySelector('#msgTemplate').innerHTML;
const hbsMsg = Handlebars.compile($msgTemplate);

//AUTOSCROLL
const autoScroll = ()=>{
    const element = $chatMsg.lastElementChild
    element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
}

//CONNECTION
socket.on('connected',(message)=>{
    $chatMsg.insertAdjacentHTML('beforeend',   
     hbsMsg(
         {username: message.username,
         message: message.text,
         time: moment(message.createdAt).format('h:mm a')
    })
     )
 autoScroll()
    })
socket.on('newUser',(message)=>{
   $chatMsg.insertAdjacentHTML('beforeend',   
    hbsMsg({
        username: message.username,
        message: message.text,
        time: moment(message.createdAt).format('h:mm a')
   })
    )
autoScroll()
})
//sidebar
const $sidebar = document.querySelector('#sidebar')
const $sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML
const hbsSidebar = Handlebars.compile($sidebarTemplate)
socket.on('room',(users)=>{
      $sidebar.innerHTML = hbsSidebar({
        room:users[0].room,
        users
})
 autoScroll()
})

//CHAT
//location
socket.on('locationMsg',(url)=>{
    $chatMsg.insertAdjacentHTML('beforeend',
        hbsMsg({
        username: url.username,
        location:'My current location',
        url:url.text,
        timeLocation:moment(url.createdAt).format('h:mm a')
       }))
    autoScroll()  
    })
//msg
socket.on('sendMsg',(msg)=>{
$chatMsg.
insertAdjacentHTML('beforeend',
hbsMsg({
    username: msg.username,
    message: msg.text,
    time: moment(msg.createdAt).format('h:mm a')
}))
autoScroll()
})

//SEND MESSAGE
const $form = document.querySelector('#msgForm')
const $message= document.querySelector('.message')
const $btnMsg = document.querySelector('.sendMsg')
$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    $message.setAttribute('disabled','disabled')
    $btnMsg.setAttribute('disabled','disabled')
    const msg = $message.value
    socket.emit('sendMessage',
    msg,
    (deliver)=>{
 console.log(deliver)
     $message.removeAttribute('disabled')
     $btnMsg.removeAttribute('disabled')
    })
     })

//SEND LOCATION
const $location = document.querySelector('.location')
$location.addEventListener('click',(e)=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }
  navigator.geolocation.getCurrentPosition((position)=>{
    const longtude = position.coords.longitude
     const latitude = position.coords.latitude
     $location.setAttribute('disabled','disabled')
     socket.emit('sendLocation',
     [longtude,latitude],
    (locationDeliver)=>{
        $location.removeAttribute('disabled')
        console.log(locationDeliver)
 })
    })
    e.preventDefault()
})

//JOIN
socket.emit('join',{username, room},(e)=>{
    alert(e)
    location.href ='/'
})

