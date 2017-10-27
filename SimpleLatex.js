/*
SimpleLatex
v1.3.0

SimpleLatex provides an slightly easier way for writing mathematical Expressions
in LaTeX.

Version 1.0.0 was built having KaTeX (https://github.com/Khan/KaTeX) functionality
in mind, but the output is valid LaTeX and therefore not limited to KaTeX.

Usage:

SimpleLatex.parse("1/23/4^5^67") // -> \frac{\frac{1}{23}}{4^{5^{67}}}
SimpleLatex.parse("int(a,b)e^x dx") // -> \int_{a}^{b}e^{x} dx
SimpleLatex.parse("matrix(1 2 3\n 4 5 6\n 7 8 9)") // -> \begin{vmatrix}1&2&3\\4&5&6\\7&8&9\end{vmatrix}
SimpleLatex.parse("1/2 + (\l 3/4)") -> \frac{1}{2} + 3/4

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
    "(" : ")",
    ")" : "(",
    "[" : "]",
    "]" : "[",
    "{" : "}",
    "}" : "{"
};

let replacements = [
	"\\func ",
	"\\func{argp}",
	"\\func{arg}",
	"\\left\\lfunc argp \\right\\rfunc",
	"\\begin{func}argppp\\end{func}",
	"\\begin{func}argpp\\end{func}",
	"\\begin{func}{args0}argsp1\\end{func}",
	"\\func{argsp0}{argsp1}",
	"\\func_{argsp0}^{argsp1}",
	"\\func_{argsp0}",
	"\\func[argsp1]{argsp0}",
]

let functionsByTopic = {
	"accents": {
		"hat": 1,
		"bar": 1,
		"dot": 1,
		"ddot": 1,
		"vec": 1,
		"overline": 1,
		"underline": 1
	},
	"delimiters": {
		"\\b": "\\backslash",
		"ceil": 3,
		"floor": 3,
		"group": 3,
		"brack": 3,
		"brace": 3,
		"ucorner": "\\ulcorner argp \\urcorner",
		"lcorner": "\\llcorner argp \\lrcorner",
		"moustache": 3,
		"uparrow": 0,
		"downarrow": 0,
		"updownarrow": 0,
		"Downarrow": 0,
		"Updownarrow": 0
	},
	"environments": {
		"matrix": 4,
		"pmatrix": 4,
		"vmatrix": 4,
		"Bmatrix": 4,
		"bmatrix": 4,
		"Vmatrix": 4,
		"array": 6,
		"darray": 6,
		"aligned": 5,
		"gathered": 5,
		"cases": 5,
		"dcases": 5
	},
	"letters": {
		"Gamma": 0,
		"Delta": 0,
		"Theta": 0,
		"Lambda": 0,
		"Xi": 0,
		"Pi": 0,
		"Sigma": 0,
		"Upsilon": 0,
		"Phi": 0,
		"Psi": 0,
		"Omega": 0,
		"alpha": 0,
		"beta": 0,
		"gamma": 0,
		"delta": 0,
		"epsilon": 0,
		"zeta": 0,
		"eta": 0,
		"theta": 0,
		"iota": 0,
		"kappa": 0,
		"lambda": 0,
		"mu": 0,
		"nu": 0,
		"xi": 0,
		"omicron": 0,
		"pi": 0,
		"rho": 0,
		"sigma": 0,
		"tau": 0,
		"upsilon": 0,
		"phi": 0,
		"chi": 0,
		"psi": 0,
		"omega": 0,
		"varepsilon": 0,
		"varkappa": 0,
		"vartheta": 0,
		"varpi": 0,
		"varrho": 0,
		"varsigma": 0,
		"varphi": 0,
		"digamma": 0,
		"imath": 0,
		"jmath": 0,
		"aleph": 0,
		"beth": 0,
		"gimel": 0,
		"daleth": 0,
		"eth": 0,
		"Finv": 0,
		"Game": 0,
		"ell": 0,
		"hbar": 0,
		"hslash": 0,
		"Im": 0,
		"Re": 0,
		"wp": 0,
		"partial": 0,
		"nabla": 0,
		"Bbbk": 0,
		"infty": 0
	},
	"annotation": {
		"cancel": 1,
		"bcancel": 1,
		"xcancel": 1,
		"sout": 1,
		"overbrace": 1,
		"underbrace": 1,
		"boxed": 1
	},
	"overlap": {
		"llap": 1,
		"rlap": 7
	},
	"spacing": {
		"quad" : 0,
		"qquad": 0,
		"enspace": 0,
		"space": 0,
		"phantom": 1,
		"kern": "\\funcarg",
		"stackrel": 7,
		"overset": 7,
		"underset": 7,
		"atop": 0
	},
	"logic": {
		"forall": 0,
		"exists": 0,
		"nexists": 0,
		"in": 0,
		"nin": "notin",
		"notin": 0,
		"ni": 0,
		"complement": 0,
		"subset": 0,
		"supset": 0,
		"mid": 0,
		"land": 0,
		"lor": 0,
		"therefore": 0,
		"because": 0,
		"mapsto": 0,
		"to": 0,
		"gets": 0,
		"leftrightarrow": 0,
		"neg": 0,
		"lnot": 0,
		"implies": 0,
		"impliedby": 0,
		"iff": 0
	},
	"set": {
		"emptyset": 0,
		"varnothing": 0,
		"\\N": "\\mathbb{N}",
		"\\Z": "\\mathbb{Z}",
		"\\Q": "\\mathbb{Q}",
		"\\A": "\\mathbb{A}",
		"\\R": "\\mathbb{R}",
		"\\C": "\\mathbb{C}",
		"\\H": "\\mathbb{H}",
		"\\O": "\\mathbb{O}",
		"\\S": "\\mathbb{S}"
	},
	"bigOperators": {
		"sum": 8,
		"int": 8,
		"iint": 8,
		"iiint": 8,
		"oint": 8,
		"intop": 8,
		"smallint": 8,
		"prod": 8,
		"coprod": 8,
		"bigvee": 8,
		"bigwedge": 8,
		"bigcap": 8,
		"bigcup": 8,
		"bigsqcup": 8,
		"bigotimes": 8,
		"bigoplus": 8,
		"bigodot": 8,
		"biguplus": 8
	},
	"binOperators": {
		"mod": 0,
		"bmod": 0
	},
	"binomialCoefficients": {
		"binom": 7,
		"choose": 0,
		"dbinom": 7,
		"tbinom": 7
	},
	"operators": {
		"pm": 0,
		"mp": 0,
		"times": 0,
		"arcsin": 0,
		"arccos": 0,
		"arctan": 0,
		"arctg": 0,
		"arcctg": 0,
		"arg": 0,
		"ch": 0,
		"cos": 0,
		"cosec": 0,
		"cosh": 0,
		"cot": 0,
		"cotg": 0,
		"coth": 0,
		"csc": 0,
		"ctg": 0,
		"cth": 0,
		"deg": 0,
		"dim": 0,
		"exp": 0,
		"hom": 0,
		"ker": 0,
		"lg": 0,
		"ln": 0,
		"sec": 0,
		"sin": 0,
		"sinh": 0,
		"sh": 0,
		"tan": 0,
		"tanh": 0,
		"tg": 0,
		"th": 0,
		"sqrt": "\\func[argsp1]{argsp0}",
		"log": 9,
		"det": 9,
		"gcd": 9,
		"inf": 9,
		"lim": 9,
		"liminf": 9,
		"limsup": 9,
		"max": 9,
		"min": 9,
		"Pr": 9,
		"sup": 9
	},
	"relations": {
		"==": "equiv",
		"equiv": 0,
		"~=": "approx",
		"approx": 0,
		"approxeq": 0,
		"asymp": 0,
		"between": 0,
		"<=": "leq",
		"leq": 0,
		"=>": "geq",
		"geq": 0,
		"owns": 0,
		"parallel": 0,
		"perp": 0,
		"!=": "neq",
		"neq": 0,
		"nparallel": 0
	},
	"extensibleArrows": {
		"xrightarrow": 10,
		"xleftarrow": 10,
		"xleftrightarrow": 10
	},
	"color": {
		"color": 2,
		"textcolor": "\\func{args0}{args1}"
	},
	"font": {
		"mathrm": 1,
		"textrm": 1,
		"rm": 1
	},
	"size": {
		"Huge": 0,
		"huge ": 0,
		"LARGE": 0,
		"Large": 0,
		"large": 0,
		"normalsize": 0,
		"small": 0,
		"footnotesize": 0,
		"scriptsize": 0,
		"tiny": 0
	},
	"style": {
		"displaystyle": 0,
		"textstyle": 0,
		"scriptstyle": 0,
		"scriptscriptstyle": 0,
		"text": 2,
		"textnormal": 2
	},
	"symbols": {
		"%": 0,
		"°": "\\degree",
		"cdots": 0,
		"ddots": 0,
		"ldots": 0,
		"vdots": 0,
		"angle": 0,
		"measuredangle": 0,
		"sphericalangle": 0,
		"checkmark": 0,
		"diagdown": 0,
		"diagup": 0,
	}
};

/* Merge functionsByTopic to functions */
let functions = {};
for (var key in functionsByTopic) {
    if (functionsByTopic.hasOwnProperty(key)) {
        Object.assign(functions, functionsByTopic[key])
    }
};

/* Make an Array of the function names, which is sorted by length (long to short),
   so that a longer function name is not misunderstood as a short one

   E.g. "int" as "\in t", insted of "\int"
*/
let functionsSorted = Object.keys(functions).sort((a, b) => {return b.length - a.length;});


/* Main function (gets called if using SimpleLatex.parse)
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
        return "";
    }

    /* If Expression begins with "\l" return unparsed */
    if(exp.length > 0 && exp.indexOf("\\l") == 0) {
        return exp.substring(2);
    }


	let tokens = [];
    let out = "";
    /* Whether the last Token requires to create a new token or not */
    let createNewToken = true;

    /* Tokenize */
    for(let i = 0; i < exp.length; i++) {
		if(["\\b", "\\N", "\\Z", "\\Q", "\\A", "\\R", "\\C", "\\H", "\\O", "\\S",
			"==", "~=", "<=", "=>", "!="].indexOf(exp[i] + exp[i + 1]) > -1) {
			tokens.push(functions[exp[i] + exp[i + 1]]);
			i++;
			createNewToken = true;
			continue;
		}

		let lastToken = tokens.length - 1;

        /* If theres a opening parenthesis, get content and add parsed to tokens,
           unless it begins with "\l" */
        if(isOpeningParenthesis(exp[i])) {
            let ans = getParentheseInterior(exp.substring(i));
            i += ans.i;

            if(ans.content.indexOf("\\l") == 0) {
                tokens.push(ans.content.substring(2));
            } else {
                tokens.push(ans.openingParenthesis + parseExpression(ans.content) + ans.closingParenthesis);
            }

            createNewToken = true;
        /* If this is an Array and/or Matrix Environment and there is a "\n" or " "
           replace by "\\" or "&"
           If the last Token contains one of these, ignore the new one,
           except the last one was "&" and the new one is "\\", then replace the last Token */
        } else if(arrayEnv && isRowSeparator(exp[i] + exp[i + 1]) || andMatrixEnv && isColumnSeparator(exp[i])) {
            if(i == 0 || i + 1 == exp.length || isColumnSeparator(tokens[lastToken]) || isRowSeparator(tokens[lastToken])) {
                if(isRowSeparator(exp[i] + exp[i + 1]) && isColumnSeparator(tokens[lastToken])) {
                    tokens[lastToken] = "\\\\";
                }
            } else if(isRowSeparator(exp[i] + exp[i + 1])) {
                tokens.push("\\\\");
            } else {
                tokens.push("&");
            }

            if(exp[i] == "\\") {
                i++;
            }

            createNewToken = true;
        } else if(isSpecialOp(exp[i])) {
            tokens.push(exp[i]);
            createNewToken = true;
        /* If its nothing from above, add to last Token (if the last token also
           was nothing from above), else create new Token
           Only here and in the functions allow this addition to the last Token */
	   } else {
            if(!createNewToken) {
                tokens[lastToken] += exp[i];
            } else {
                tokens.push(exp[i]);
            }

            createNewToken = false;
        }
    }
console.log(tokens)
	/* Loop through the Tokens and parse possible Functions */
	for(let i = 0; i < tokens.length; i++) {
		if(/^[^a-z°%]+$/g.test(tokens[i])) {
			continue
		}

		let match = "";
		let possible = [];

		for(let j = 0; j < functionsSorted.length; j++) {
			if(functionsSorted[j] == tokens[i]) {
				match = functionsSorted[j];
			} else if(tokens[i].length > 2 && functionsSorted[j].indexOf(tokens[i]) == 0) {
				possible.push(functionsSorted[j]);
			}
		}

		if(match == "" && possible.length != 1) {
			continue
		}

		let func = match || possible[0];
		if(functions[functions[func]] != null) {
			func = functions[func]
		}

		let token = functions[func];
		if(Number.isInteger(functions[func])) {
			token = replacements[functions[func]];
		}


		let tokenI1 = tokens[i + 1] || "";
		if(token.indexOf("arg") > -1 && isOpeningParenthesis(tokenI1[0])) {
			tokens[i] = parseFunction(func, token, tokenI1.substring(1, tokenI1.length - 1));
			tokens.splice(i + 1, 1);
		} else {
			tokens[i] = parseFunction(func, token);
		}
	}

    /* Loop backwards through the Tokens (so that this can handle stacked Expressions like 1^2^3)
       and group the Tokens into one
       If the Token after the "^" or "_" is a "-", then take the Token after the Minus too
       If the base contains Parentheses, keep them (and add the Latex Code for size adjusting),
       if the exponent contains Parentheses, remove them (not necessary to show, due to superposition) */
    for(let i = tokens.length - 1; i > 0; i--) {
        if(tokens[i] == "^" || tokens[i] == "_") {
            let beginsWithMinus = 1;

            if(tokens[i + 1] == "-") {
                beginsWithMinus = 2;
            }

            tokens[i] = maybeParenthese(tokens[i - 1]) + tokens[i] + "{" + (beginsWithMinus == 2 ? "-" : "") + stripParenthese(tokens[i + beginsWithMinus]) + "}";
            tokens.splice(i - 1, 1);
            tokens.splice(i, beginsWithMinus);
            i -= beginsWithMinus;
        }
    }

    /* Loop forwards through the Tokens (so that this can handle stacked Expressions like 1/2/3)
       and group the Tokens into one, adding the Latex Code for a Fraction
       If the Token after the "^" or "_" is a "-", then take the Token after the Minus too
       If the numerator or denominator contains Parentheses, remove them (not necessary to show, due to Fraction Sign) */
    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] == "/") {
            let beginsWithMinus = 1;

            if(tokens[i + 1] == "-") {
                beginsWithMinus = 2;
            }

            tokens[i] = "\\frac{" + stripParenthese(tokens[i - 1]) + "}{" + (beginsWithMinus == 2 ? "-" : "") + stripParenthese(tokens[i + beginsWithMinus]) + "}";
            tokens.splice(i - 1, 1);
            tokens.splice(i, beginsWithMinus);
            i -= beginsWithMinus;
        }
    }

    /* Write the Tokens to the output string
       If there are Parentheses keep them (and add the Latex Code for size adjusting),
       unless parsing a Matrix Environment, then remove them */
    for(let i = 0; i < tokens.length; i++) {
        if(andMatrixEnv) {
            out += stripParenthese(tokens[i]);
        } else {
            out += maybeParenthese(tokens[i]);
        }
    }

    return out;
}

/* Takes the function, the token and the optional argument
   and returns the parsed function */
function parseFunction(func, token, arg = "") {
	token = token.replace(/func/g, func);

	if(token.indexOf("arg") > -1) {
		let args = splitArgs(arg)

		token = token.replace(/arg(s{0,1})(p*)([0-9]*)/g, (a, b, c, d) => {
			a = b == "s" ? args[d] : arg
			if(a == null) {return ""}
			if(b.length == 3) {return parseExpression(a, true, true)}
			if(b.length == 2) {return parseExpression(a, true)}
			if(b.length == 1) {return parseExpression(a)}
			if(b.length == 0) {return a || ""}
			return ""
		});
	}

	return token
}

/* Takes an Expression starting at a Parenthese and returns the length, the content
   and the type of the Interior of that Parenthese */
function getParentheseInterior(exp) {
    let openingParenthesis = exp[0];
    let closingParenthesis = matchingParentheses[openingParenthesis];

    let content = "";
    let parentheses = 1;
    let i = 1;

    while(parentheses > 0 && i < exp.length) {
        if(exp[i] == closingParenthesis) {
            parentheses--;
        } else if(exp[i] == openingParenthesis) {
            parentheses++;
        }

        if(parentheses > 0) {
            content += exp[i];
            i++;
        }
    }

    return {
        i : i,
        content : content,
        openingParenthesis : openingParenthesis,
        closingParenthesis : closingParenthesis
    }
}

/* Takes an Expression and returns the Arguments, splitten by ","
   regards Parentheses */
function splitArgs(exp) {
    let args = [];
    let parentheses = 0;
    let temp = "";

    for(let i = 0; i < exp.length; i++) {
        if(isOpeningParenthesis(exp[i])) {
            let ans = getParentheseInterior(exp.substring(i));
            i += ans.i;
            temp += ans.openingParenthesis + ans.content + ans.closingParenthesis;
        } else if(exp[i] == ",") {
            args.push(temp);
            temp = "";
        } else {
            temp += exp[i];
        }
    }

    args.push(temp);

    return args;
}

function isSpecialOp(exp) {
    return /[^0-9a-z!]/i.test(exp);
}

function isOpeningParenthesis(exp) {
    return exp == "(" || exp == "[" || exp == "{";
}

/* If Expression starts with (and ends with matching) Parentheses,
   remove them, leaving only the Interior */
function stripParenthese(exp = "") {
    let end = exp.length - 1;

    if(isOpeningParenthesis(exp[0]) && exp[end] == matchingParentheses[exp[0]]) {
        exp = exp.substring(1, end);
    }

    return exp;
}

/* If Expression starts with (and ends with matching) Parentheses,
   add the Latex Code for size adjusting ("\left" and "\right") before the Parentheses */
function maybeParenthese(exp = "") {
    let end = exp.length - 1;

    if(isOpeningParenthesis(exp[0]) && exp[end] == matchingParentheses[exp[0]]) {
        exp = "\\left" + (exp[0] == "{" ? "\\" : "") + exp.substring(0, end) + "\\right" + (exp[end] == "}" ? "\\" : "") + exp[end];
    }

    return exp;
}

function isRowSeparator(exp = "") {
    return exp == "\\\\" || exp[0] == "\n";
}

function isColumnSeparator(exp) {
    return exp == " " || exp == "&";
}

    return {
        "parse" : parseExpression,
        "functionsByTopic" : functionsByTopic,
        "functions" : functions,
        "functionsSorted" : functionsSorted
    }
})()