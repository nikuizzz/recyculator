let debug = false

if(debug) {
    document.querySelectorAll(".debug").forEach( element => {
        let r = Math.floor( Math.random() * 255 )
        let g = Math.floor( Math.random() * 255 )
        let b = Math.floor( Math.random() * 255 )
        
        element.style.backgroundColor = `rgb(${r},${g},${b})`
    })
}

