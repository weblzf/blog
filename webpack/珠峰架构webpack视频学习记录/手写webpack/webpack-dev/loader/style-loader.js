function loader(params) {
    let style = `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(params)}
        document.head.appendChild(style)
    `
    return style
}

module.exports = loader