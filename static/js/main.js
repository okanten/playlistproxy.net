const $ = id => {
  return document.getElementById(id)
}


window.addEventListener('load', () => {
  $("btnSubmit").addEventListener("click", (event) => {
    event.preventDefault()
    $("copyProgress").classList.remove("error")
    createPlaylist()
    $("clonePlaylistForm").reset()
  })
})

// https://stackoverflow.com/a/43467144
const checkUrl = (playlistUrl => {
  if (playlistUrl === "") {
    return false;
  }
  let url;
  try {
    url = new URL(playlistUrl)
  } catch(_) {
    return false;
  }
  if(!(url.protocol === "http:" || url.protocol === "https:")) {
    return false;
  }
  
  if(!(url.hostname === "www.spotify.com" || "spotify.com")) {
    return false;
  }
  
  return true;

})

  const createPlaylist = () => {
  let playlistName = $("playlistName").value
  let playlistDesc = $("playlistDesc").value
  let playlistUrl = $("playlistUrl").value
  if (!checkUrl(playlistUrl)) { 
    $("copyProgress").innerHTML = "url is not valid";
    $("copyProgress").classList.add("error");
    return false;
  }
  let createPlData = { "name": playlistName, "description": playlistDesc }
  const url = 'https://api.playlistproxy.net/create-playlist/'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPlData)
  })
  const newPlaylist = await response.json()
  const { playlistId } = newPlaylist
  if (playlistId) {
    $("proxyPlaylistIdUri").value = "spotify:playlist:" + playlistId
    $("proxyPlaylistIdUrl").innerHTML = "https://open.spotify.com/playlist/" + playlistId
    $("proxyPlaylistIdUrl").setAttribute("href", "https://open.spotify.com/playlist/" + playlistId)
    $("playlistSection").classList.remove("hidden")
    $("proxyPlaylistIdUri").focus()
    const clonePlData = { "url": playlistUrl, ...newPlaylist}
    clonePlaylist(clonePlData)
  }
}

const clonePlaylist = async (clonePlData) => {
  console.log(clonePlData)
  const url = 'https://api.playlistproxy.net/clone-playlist/'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clonePlData)
  })
  const finished = await response.json()
  if (finished.success) {
    $("copyProgress").innerHTML = "Finished!"
  } else {
    $("copyProgress").innerHTML = finished.error
    $("copyProgress").classList.add("error")
  }
}
