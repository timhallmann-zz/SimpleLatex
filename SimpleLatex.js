/*
SimpleLatex
v1.0.0

This function provides an slightly easier way for writing mathematical Expressions
in LaTeX.

Version 1.0.0 was built having KaTeX (https://github.com/Khan/KaTeX) functionality
in mind, but the output is valid LaTeX and therefore not limited to KaTeX.

MIT License

Copyright (c) 2017 Tim Hallmann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

let SimpleLatex = (function() {

let matchingParentheses = {
    '(' : ')',
    ')' : '(',
    '[' : ']',
    ']' : '[',
    '{' : '}',
    '}' : '{'
}

/* Definition of the functions
    key : name of function
    value : replacement or ID for replacement

    IDs:
    00: f
    10: \f
    20: \f{0} (unparsed)
    30: \f{0}
    40: \f{0}{1}
    50: \f_{0}^{1}
    51: \f_{0}
    60: \f[1]{0}
    70: \begin{f}{1}{0}\end{f}
    71: \begin{f}{0}\end{f}

*/

let functions = {
    '%' : 10,
    '    ' : '\\quad ',
    '°' : '\\degree ',


    // ACCENTS
    'hat' : 30,
    'bar' : 30,
    'dot' : 30,
    'ddot' : 30,
    'vec' : 30,
    'overline' : 30,
    'underline' : 30,



    // DELIMITERS
    '\\|' : 10,
    '\\b' : '\\backslash ',

    'lgroup' : 10,
    'rgroup' : 10,
    'lbrack' : 10,
    'rbrack' : 10,
    'lbrace' : 10,
    'rbrace' : 10,
    'lceil' : 10,
    'rceil' : 10,
    'lfloor' : 10,
    'rfloor' : 10,
    'urcorner' : 10,
    'rbrace' : 10,
    'llcorner' : 10,
    'lrcorner' : 10,
    'lmoustache' : 10,
    'rmoustache' : 10,
    'uparrow' : 10,
    'downarrow' : 10,
    'updownarrow' : 10,
    'Downarrow' : 10,
    'Updownarrow' : 10,


    // ENVIRONMENTS
    'matrix' : 71,
    'pmatrix' : 71,
    'vmatrix' : 71,
    'Bmatrix' : 71,
    'bmatrix' : 71,
    'Vmatrix' : 71,

    'array' : 70,
    'darray' : 70,
    'aligned' : 70,
    'gathered' : 70,
    'cases' : 70,
    'dcases' : 70,


    // LETTERS
    'Gamma' : 10,
    'Delta' : 10,
    'Theta' : 10,
    'Lambda' : 10,
    'Xi' : 10,
    'Pi' : 10,
    'Sigma' : 10,
    'Upsilon' : 10,
    'Phi' : 10,
    'Psi' : 10,
    'Omega' : 10,

    'alpha' : 10,
    'beta' : 10,
    'gamma' : 10,
    'delta' : 10,
    'epsilon' : 10,
    'zeta' : 10,
    'eta' : 10,
    'theta' : 10,
    'iota' : 10,
    'kappa' : 10,
    'lambda' : 10,
    'mu' : 10,
    'nu' : 10,
    'xi' : 10,
    'omicron' : 10,
    'pi' : 10,
    'rho' : 10,
    'sigma' : 10,
    'tau' : 10,
    'upsilon' : 10,
    'phi' : 10,
    'chi' : 10,
    'psi' : 10,
    'omega' : 10,
    'varepsilon' : 10,
    'varkappa' : 10,
    'vartheta' : 10,
    'varpi' : 10,
    'varrho' : 10,
    'varsigma' : 10,
    'lambda' : 10,
    'varphi' : 10,
    'digamma' : 10,

    'imath' : 10,
    'jmath' : 10,
    'aleph' : 10,
    'beth' : 10,
    'gimel' : 10,
    'daleth' : 10,
    'eth' : 10,
    'Finv' : 10,
    'Game' : 10,
    'ell' : 10,
    'hbar' : 10,
    'hslash' : 10,
    'Im' : 10,
    'Re' : 10,
    'wp' : 10,
    'partial' : 10,
    'nabla' : 10,
    'Bbbk' : 10,
    'infty' : 10,


    // ANNOTATION
    'cancel' : 30,
    'bcancel' : 30,
    'xcancel' : 30,
    'sout' : 30,
    'overbrace' : 30,
    'underbrace' : 30,
    'boxed' : 30,


    // OVERLAP
    'llap' : 30,
    'rlap' : 40,


    // SPACING
    '\\!' : 0,
    '\\,' : 0,
    '\\:' : 0,
    '\\;' : 0,
    'enspace' : 10,
    'qquad' : 10,
    '~' : 0,
    'space' : 10,
    'phantom' : 30,
    'kern' : 30,
    'stackrel' : 40,
    'overset' : 40,
    'underset' : 40,
    'atop' : 10,


    // LOGIC AND SET THEORY
    'forall' : 10,
    'exists' : 10,
    'nexists' : 10,
    'in' : 10,
    'notin' : 10,
    'nin' : '\\notin ',
    'ni' : 10,
    'complement' : 10,
    'subset' : 10,
    'supset' : 10,
    'mid' : 10,
    'land' : 10,
    'lor' : 10,
    'therefore' : 10,
    'because' : 10,
    'mapsto' : 10,
    'to' : 10,
    'gets' : 10,
    'leftrightarrow' : 10,
    'neg' : 10,
    'lnot' : 10,
    'implies' : 10,
    'impliedby' : 10,
    'iff' : 10,

    'emptyset' : 10,
    'varnothing' : 10,
    '\\N' : '\\mathbb{N}',
    '\\Z' : '\\mathbb{Z}',
    '\\Q' : '\\mathbb{Q}',
    '\\A' : '\\mathbb{A}',
    '\\R' : '\\mathbb{R}',
    '\\C' : '\\mathbb{C}',
    '\\H' : '\\mathbb{H}',
    '\\O' : '\\mathbb{O}',
    '\\S' : '\\mathbb{S}',


    // BIG OPERATORS
    'sum' : 50,
    'int' : 50,
    'iint' : 50,
    'iiint' : 50,
    'oint' : 50,
    'intop' : 50,
    'smallint' : 50,
    'oint' : 50,
    'prod' : 50,
    'coprod' : 50,
    'bigvee' : 50,
    'bigwedge' : 50,
    'bigcap' : 50,
    'bigcup' : 50,
    'bigsqcup' : 50,
    'bigotimes' : 50,
    'bigoplus' : 50,
    'bigodot' : 50,
    'biguplus' : 50,


    // BINARY OPERATORS
    'mod' : 10,


    // BINOMIAL COEFFICIENTS
    'binom' : 40,
    'choose' : 30,
    'dbinom' : 40,
    'tbinom' : 40,


    // MATH OPERATORS
    'pm' : 10,
    'mp' : 10,
    'times' : 10,
    'sqrt' : 60,

    'arcsin' : 10,
    'arccos' : 10,
    'arctan' : 10,
    'arctg' : 10,
    'arcctg' : 10,
    'arg' : 10,
    'ch' : 10,
    'cos' : 10,
    'cosec' : 10,
    'cosh' : 10,
    'cot' : 10,
    'cotg' : 10,
    'coth' : 10,
    'csc' : 10,
    'ctg' : 10,
    'cth' : 10,
    'deg' : 10,
    'dim' : 10,
    'exp' : 10,
    'hom' : 10,
    'ker' : 10,
    'lg' : 10,
    'ln' : 10,
    'log' : 51,
    'sec' : 10,
    'sin' : 10,
    'sinh' : 10,
    'sh' : 10,
    'tan' : 10,
    'tanh' : 10,
    'tg' : 10,
    'th' : 10,

    'det' : 51,
    'gcd' : 51,
    'inf' : 51,
    'lim' : 51,
    'liminf' : 51,
    'limsup' : 51,
    'max' : 51,
    'min' : 51,
    'Pr' : 51,
    'sup' : 51,


    // RELATIONS
    '==' : '\\equiv ',
    'equiv' : 10,
    '~=' : '\\approx ',
    'approx' : 10,
    'approxeq' : 10,
    'asymp' : 10,
    'between' : 10,
    '<=' : '\\leq',
    'leq' : 10,
    '=>' : '\\geq',
    'geq' : 10,
    'owns' : 10,
    'parallel' : 10,
    'perp' : 10,

    '!=' : '\\neq ',
    'neq' : 10,
    'nparallel' : 10,


    // EXTENSIBLE ARROWS
    'xrightarrow' : 60,
    'xleftarrow' : 60,
    'xleftrightarrow' : 60,


    // COLOR
    'color' : 20,
    'textcolor' : 40,


    // FONT
    'mathrm' : 30,
    'textrm' : 30,
    'rm' : 30,


    // SIZE
    'Huge' : 10,
    'huge ' : 10,
    'LARGE' : 10,
    'Large' : 10,
    'large' : 10,
    'normalsize' : 10,
    'small' : 10,
    'footnotesize' : 10,
    'scriptsize' : 10,
    'tiny' : 10,


    // STYLE
    'displaystyle' : 10,
    'textstyle' : 10,
    'scriptstyle' : 10,
    'scriptscriptstyle' : 10,
    'text' : 20,
    'textnormal' : 20,


    // SYMBOLS AND PUNCTUATION
    'cdots' : 10,
    'ddots' : 10,
    'ldots' : 10,
    'vdots' : 10,
    'angle' : 10,
    'measuredangle' : 10,
    'sphericalangle' : 10,
    'checkmark' : 10,
    'diagdown' : 10,
    'diagup' : 10,
}

/* Make an Array of the function names, which is sorted by length (long to short),
   so that a longer function name is not misunderstood as a short one

   E.g. "int" as "\in t", insted of "\int"
*/
let functionsSorted = Object.keys(functions).sort(function(a, b){return b.length - a.length})


/* Main function (gets called if using SimpleLatex)
   Tokenizes the Expression (exp), evaluates the Tokens (calling itself) and joins
   them to the Latex Output

   The Expression given to SimpleLatex and everything in Parentheses "()[]{}" is
   going to be evaluated by this function, which means that everything in
   Parentheses has its own "Scope"

   Arguments:
   exp (String) The Expression
   arrayEnv (Bool) If parsing a Latex Array Environment, convert "\n" to "\\"
   andMatrixEnv (Bool) If parsing a Latex Matrix Environment, convert " " to "&"
*/
function parseExpression(exp, arrayEnv = false, andMatrixEnv = false) {
    if(exp == null || exp.length == 0) {
        return ''
    }

    // If Expression begins with "\l" return unparsed
    if(exp.length > 0 && exp.indexOf('\\l') == 0) {
        return exp.substring(2)
    }

    let tokens = []
    let out = ''
    // Whether the last Token requires to create a new token or not
    let createNewToken = true

    // Create a new Array containing only functions, which may be in the Expression
    let possibleFunctions = functionsSorted.filter(func => {
        return exp.indexOf(func) > -1
    })

    // Main Loop for Tokenizing
    // Label for continue in first inner loop
    loop1:
    for(let i = 0; i < exp.length; i++) {
        let tokenLength = tokens.length
        let lastToken = tokenLength - 1

        // Tests if the Expression beginning at Index is equal to a possible Function
        // If it is a function, parse it and continue after the function, with
        // the length of the function returned by parseFunction
        let expI = exp.substring(i)

        for(let j = 0; j < possibleFunctions.length; j++) {
            if(expI.indexOf(possibleFunctions[j]) == 0) {
                let ans = parseFunction(expI, possibleFunctions[j])

                i += ans.l

                if(!createNewToken) {
                    tokens[lastToken] += ans.t
                } else {
                    tokens.push(ans.t)
                }

                createNewToken = false

                continue loop1
            }
        }

        // If theres a opening parenthesis, get content and add parsed to tokens,
        // unless it begins with "\l"
        if(isOpeningParenthesis(exp[i])) {
            let ans = getParentheseInterior(expI)
            i += ans.i

            if(ans.content.indexOf('\\l') == 0) {
                tokens.push(ans.content.substring(2))
            } else {
                tokens.push(ans.openingParenthesis + parseExpression(ans.content) + ans.closingParenthesis)
            }

            createNewToken = true
        // If this is an Array and/or Matrix Environment and there is a "\n" or " "
        // replace by "\\" or "&"
        // If the last Token contains one of these, ignore the new one,
        // except the last one was "&" and the new one is "\\", then replace the last Token
        } else if(arrayEnv && isRowSeparator(exp[i] + exp[i + 1]) || andMatrixEnv && isColumnSeparator(exp[i])) {
            if(i == 0 || i + 1 == exp.length || isColumnSeparator(tokens[lastToken]) || isRowSeparator(tokens[lastToken])) {
                if(isRowSeparator(exp[i] + exp[i + 1]) && isColumnSeparator(tokens[lastToken])) {
                    tokens[lastToken] = '\\\\'
                }
            } else if(isRowSeparator(exp[i] + exp[i + 1])) {
                tokens.push('\\\\')
            } else {
                tokens.push('&')
            }

            if(exp[i] == '\\') {
                i++
            }

            createNewToken = true
        } else if(isSpecialOp(exp[i])) {
            tokens.push(exp[i])
            createNewToken = true
        // If its nothing from above, add to last Token (if the last token also
        // was nothing from above), else create new Token
        // Only here and in the functions allow this addition to the last Token
        } else {
            if(!createNewToken) {
                tokens[lastToken] += exp[i]
            } else {
                tokens.push(exp[i])
            }

            createNewToken = false
        }
    }

    // Loop backwards through the Tokens (so that this can handle stacked Expressions like 1^2^3)
    // and group the Tokens into one
    // If the Token after the "^" or "_" is a "-", then take the Token after the Minus too
    // If the base contains Parentheses, keep them (and add the Latex Code for size adjusting),
    // if the exponent contains Parentheses, remove them (not necessary to show, due to superposition)
    for(let i = tokens.length - 1; i > 0; i--) {
        if(tokens[i] == '^' || tokens[i] == '_') {
            let beginsWithMinus = 1

            if(tokens[i + 1] == '-') {
                beginsWithMinus = 2
            }

            tokens[i] = maybeParenthese(tokens[i - 1]) + tokens[i] + '{' + (beginsWithMinus == 2 ? '-' : '') + stripParenthese(tokens[i + beginsWithMinus]) + '}'
            tokens.splice(i - 1, 1)
            tokens.splice(i, beginsWithMinus)
            i -= beginsWithMinus
        }
    }

    // Loop forwards through the Tokens (so that this can handle stacked Expressions like 1/2/3)
    // and group the Tokens into one, adding the Latex Code for a Fraction
    // If the Token after the "^" or "_" is a "-", then take the Token after the Minus too
    // If the numerator or denominator contains Parentheses, remove them (not necessary to show, due to Fraction Sign)
    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] == '/') {
            let beginsWithMinus = 1

            if(tokens[i + 1] == '-') {
                beginsWithMinus = 2
            }

            tokens[i] = '\\frac{' + stripParenthese(tokens[i - 1]) + '}{' + (beginsWithMinus == 2 ? '-' : '') + stripParenthese(tokens[i + beginsWithMinus]) + '}'
            tokens.splice(i - 1, 1)
            tokens.splice(i, beginsWithMinus)
            i -= beginsWithMinus
        }
    }

    // Write the Tokens to the Output String
    // If there are Parentheses keep them (and add the Latex Code for size adjusting),
    // unless parsing a Matrix Environment, then remove them
    for(let i = 0; i < tokens.length; i++) {
        if(andMatrixEnv) {
            out += stripParenthese(tokens[i])
        } else {
            out += maybeParenthese(tokens[i])
        }
    }

    return out
}

// Takes an Expression starting at the function and the function,
// returns the the length of the parsed Function and the parsed Function
function parseFunction(exp, func) {
    let i = func.length

    let token
    let arg
    let args = []

    // If the Function takes Arguments, check for Parentheses and split the Arguments
    // Increase the index by the length of the Arguments
    if(functions[func] >= 20 && isOpeningParenthesis(exp[i])) {
        let interior = getParentheseInterior(exp.substring(i))
        i += interior.i + 1

        arg = interior.content
        args = splitArgs(arg)
    }

    switch(functions[func]) {
        case 0: // f
            token = func + ' '
            break;
        case 10: // \f
            token = '\\' + func + ' '
            break;
        case 20:  // \f{0} unparsed
            token = '\\' + func + '{' + (arg == null ? '' : arg) + '}'
            break;
        case 30:  // \f{0}
            token = '\\' + func + '{' + parseExpression(arg) + '}'
            break;
        case 40: // \f{0}{1}
            token = '\\' + func + '{' + parseExpression(args[0]) + '}{' + parseExpression(args[1]) + '}'
            break;
        case 50: // \f_{0}^{1}
            token = '\\' + func + '_{' + parseExpression(args[0]) + '}^{' + parseExpression(args[1]) + '}'
            break;
        case 51: // \f_{0}
            token = '\\' + func + '_{' + parseExpression(args[0]) + '}'
            break;
        case 60: // \f[1]{0}
            token = '\\' + func + '[' + parseExpression(args[1]) + ']{' + parseExpression(args[0]) + '}'
            break;
        case 70: // \begin{f}{1}{0}\end{f}
            token = '\\begin{' + func + '}{' + parseExpression(args[1]) + '}' + parseExpression(args[0], true) + '\\end{' + func + '}'
            break;
        case 71: // \begin{f}{0}\end{f}
            token = '\\begin{' + func + '}' + parseExpression(arg, true, true) + '\\end{' + func + '}'
            break;
        default:
            token = functions[func]
    }

    return {
        l : i - 1,
        t : token
    }
}

// Takes an Expression starting at a Parenthese and returns the length, the content
// and the type of the Interior of that Parenthese
function getParentheseInterior(exp) {
    let openingParenthesis = exp[0]
    let closingParenthesis = matchingParentheses[openingParenthesis]

    let content = ''
    let parentheses = 1
    let i = 1

    while(parentheses > 0 && i < exp.length) {
        if(exp[i] == closingParenthesis) {
            parentheses--
        } else if(exp[i] == openingParenthesis) {
            parentheses++
        }

        if(parentheses > 0) {
            content += exp[i]
            i++
        }
    }

    return {
        i : i,
        content : content,
        openingParenthesis : openingParenthesis,
        closingParenthesis : closingParenthesis
    }
}

// Takes an Expression and returns the Arguments, splitten by ","
// Regards Parentheses
function splitArgs(exp) {
    let args = []
    let parentheses = 0
    let temp = ''

    for(let i = 0; i < exp.length; i++) {
        if(isOpeningParenthesis(exp[i])) {
            let ans = getParentheseInterior(exp.substring(i))
            i += ans.i
            temp += ans.openingParenthesis + ans.content + ans.closingParenthesis
        } else if(exp[i] == ',') {
            args.push(temp)
            temp = ''
        } else {
            temp += exp[i]
        }
    }

    args.push(temp)

    return args
}

function isSpecialOp(exp) {
    return /[^0-9a-z!°]/i.test(exp)
}

function isOpeningParenthesis(exp) {
    return exp == '(' || exp == '[' || exp == '{'
}

// If Expression starts with (and ends with matching) Parentheses,
// remove them, leaving only the Interior
function stripParenthese(exp = '') {
    let end = exp.length - 1

    if(isOpeningParenthesis(exp[0]) && exp[end] == matchingParentheses[exp[0]]) {
        exp = exp.substring(1, end)
    }

    return exp
}

// If Expression starts with (and ends with matching) Parentheses,
// add the Latex Code for size adjusting ("\left" and "\right") before the Parentheses
function maybeParenthese(exp = '') {
    let end = exp.length - 1

    if(isOpeningParenthesis(exp[0]) && exp[end] == matchingParentheses[exp[0]]) {
        exp = '\\left' + (exp[0] == '{' ? '\\' : '') + exp.substring(0, end) + '\\right' + (exp[end] == '}' ? '\\' : '') + exp[end]
    }

    return exp
}

function isRowSeparator(exp = '') {
    return exp == '\\\\' || exp[0] == '\n'
}

function isColumnSeparator(exp) {
    return exp == ' ' || exp == '&'
}

    return parseExpression
})()