console.log('Script loaded, writing to console')
const trs = document.querySelectorAll('.track')
const titles = document.querySelectorAll('.track__title')

function getBCItemLink (url, currentTrack) {
  const req = new XMLHttpRequest() //eslint-disable-line
  req.open('GET', url, true)
  req.onload = (e) => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        const bcHTML = DOMPurify.sanitize(req.responseText)
        console.log('sanitized html')
        const domParser = new DOMParser()
        const bcDOM = domParser.parseFromString(bcHTML, 'text/html')

        const bcItemLink = bcDOM.querySelector('.itemurl')

        const bcImg = document.createElement('img')
        const bcImgURL = chrome.runtime.getURL('icons/bc_log.svg')
        bcImg.setAttribute('src', bcImgURL)
        bcImg.setAttribute('alt', 'link to bandcamp')
        bcImg.style.height = '.75em'
        bcImg.style.float = 'inherit'
        bcImg.style.marginLeft = '10px'

        const bcNode = document.createElement('a')
        bcNode.setAttribute('href', bcItemLink.innerText)
        bcNode.appendChild(bcImg)
        console.log(bcItemLink)

        currentTrack.appendChild(bcNode)
        console.log(bcNode.innerHTML)
      } else {
        console.error('Returned error code', req.status)
        console.error(req.statusText)
      }
    }
  }
  req.onerror = (e) => {
    console.error('Returned error code', req.status)
    console.error(req.statusText)
  }
  req.send(null)
}

for (let i = 0; i < trs.length; i++) {
  const currentTrack = trs[i]
  const currentChildren = currentTrack.children
  const artists = [...currentChildren].filter(element => element.classList.contains('track__artist'))
  const artist = artists.reduce((acc, elem) => { return acc + elem.innerText }, '')
  const title = titles[i].innerHTML
  const bcSearchURL = 'https://bandcamp.com/search?q=' + artist.replace(/ /g, '+') + '+' + title.replace(/ /g, '+') + '&item_type='
  getBCItemLink(bcSearchURL, currentTrack)
}
