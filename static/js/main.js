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
  if (playlistUrl == "") {
    return "Spotify URL cannot be empty"
  }
  let url;
  try {
    url = new URL(playlistUrl)
  } catch(_) {
    return "Not a valid URL"
  }
  if(!(url.protocol == "http:" || url.protocol == "https:" || url.protocol == "spotify:")) {
    console.log("Failed at protocol check")
    return "URL/URI protocol is not valid (must be http:, https: or spotify:)"
  }
   
  if(url.protocol != "spotify:" && url.hostname != "www.open.spotify.com" && url.hostname != "open.spotify.com" && url.hostname != "spotify.link") {
    console.log("failed at hostname")
    return "Hostname is not valid (must be open.spotify.com or spotify URI)"
  }
  
  return true;

})

const createPlaylist = async () => {
  $("btnSubmit").setAttribute("disabled", true);
  $("btnSubmit").value = "Creating playlist";
  $("errorSection").classList.add("hidden")
  $("playlistSection").classList.add("hidden")
  let playlistName = $("playlistName").value
  let playlistDesc = null
  let playlistUrl = $("playlistUrl").value
  const urlValid = checkUrl(playlistUrl)
  if (urlValid !== true) { 
    console.log("Failed url check")
    $("error").innerHTML = urlValid;
    $("errorSection").classList.remove("hidden")
    $("instructions").classList.add("hidden")
    $("btnSubmit").removeAttribute("disabled");
    return false;
  }
  let createPlData = { "name": playlistName, "description": playlistDesc, "url": playlistUrl }
  const url = 'https://api.playlistproxy.net/create-playlist'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPlData)
  })
  if (!response.ok) {
    const error = await response.json()
    $("error").innerHTML = error.message;
    $("errorSection").classList.remove("hidden")
    $("instructions").classList.add("hidden")
    $("btnSubmit").removeAttribute("disabled");
    $("btnSubmit").value = "Anonymize";
    return false;
  }
  const newPlaylist = await response.json()
  const { playlistId } = newPlaylist
  if (playlistId) {
    $("proxyPlaylistIdUri").value = "spotify:playlist:" + playlistId
    $("proxyPlaylistIdUrl").innerHTML = "https://open.spotify.com/playlist/" + playlistId
    $("proxyPlaylistIdUrl").setAttribute("href", "https://open.spotify.com/playlist/" + playlistId)
    $("playlistSection").classList.remove("hidden")
    $("proxyPlaylistIdUri").focus()
    //const clonePlData = { "url": playlistUrl, ...newPlaylist}
    clonePlaylist(newPlaylist)
  }
  $("btnSubmit").removeAttribute("disabled");
  $("btnSubmit").value = "Anonymize";
}

const clonePlaylist = async (clonePlData) => {
  const url = 'https://api.playlistproxy.net/clone-playlist'
$("instructions").classList.add("hidden")
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
