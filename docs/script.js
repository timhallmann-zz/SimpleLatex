if(document.readyState === 'complete') {
    init()
} else {
    document.addEventListener('DOMContentLoaded', init, false)
}

function init() {
    inputEl = document.getElementById('input')
    katexEl = document.getElementById('katex')
    latexEl = document.getElementById('latex')

    currentLines = []

    inputEl.addEventListener('input', onInput)
}

// Separate after 3 Linebreaks and manage the elements for them
function onInput(event) {
    let input = event.target.value

    let lines = input.split("\n\n\n")

    for(let i = lines.length; i < currentLines.length; i++) {
        currentLines[i] = ''

        document.getElementById('katex' + i).innerText = ''
        document.getElementById('latex' + i).innerText = ''
    }

    for(let i = currentLines.length; i < lines.length; i++) {
        currentLines[i] = ''
        katexEl.insertAdjacentHTML('beforeend', '<div id="katex' + i + '"></div>')
        latexEl.insertAdjacentHTML('beforeend', '<p id="latex' + i + '"></p>')
    }

    for(let i = 0; i < lines.length; i++) {
        let line = lines[i].replace(/\n$/g, '')

        if(line != currentLines[i]) {
            currentLines[i] = line
            parseLine(i, line)
        }
    }
}

function parseLine(lineNumber, line) {
    let latex = SimpleLatex.parse(line)

    document.getElementById('latex' + lineNumber).innerHTML = latex

    katex.render(latex, document.getElementById('katex' + lineNumber), {displayMode : true})
}