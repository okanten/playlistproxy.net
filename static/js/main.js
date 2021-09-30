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

const createPlaylist = async () => {
  let playlistName = $("playlistName").value
  let playlistDesc = $("playlistDesc").value
  let playlistUrl = $("playlistUrl").value
  let createPlData = { "name": playlistName, "description": playlistDesc }
  const response = await fetch('http://localhost:8000/create-playlist/', {
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
    $("playlistSection").classList.toggle("hidden")
    $("proxyPlaylistIdUri").focus()
    const clonePlData = { "url": playlistUrl, ...newPlaylist}
    clonePlaylist(clonePlData)
  }
}

const clonePlaylist = async (clonePlData) => {
  console.log(clonePlData)
  const response = await fetch('http://localhost:8000/clone-playlist/', {
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
