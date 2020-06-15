var remove = document.getElementById('dislike')

if(remove){
    remove.addEventListener('click', onremove)
}

function onremove(ev){
    // zoek de event.target
    var node = ev.target
    
    //console.log "node" om de event.target te zien
    console.log(node)
    //console.log "node.dataset.value" om de id te zien
    console.log(node.dataset.value)

    fetch(`/home/${node.dataset.value}`, {method: 'delete'})
    .then(onresponse)
    .then(onload)
    .catch(error)
    
    //console.log "clicked" wanneer er wordt geclicked
    console.log('clicked')

    function onresponse(res){
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
        return JSON.parse('false'),
        console.log('succes')
    }

    function onload(){
     return   window.location.href = '/home'
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    function error(){
       console.log('Error')
    }
}   