/*
SimpleLatex
v1.2.0

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

/* Definition of the functions
    key : name of function
    value : {args : Bool, val : replacement (default is func{args})}

    Replacement is done by adding "\" + value + " "
    (func, args, args0, args1, ... will be replaced by the according func/args)
*/

let functionsByTopic = {
	"misc": {
		"%": {v: 0},
		"    ": {v: "quad"},
		"°": {v: "degree"}
	},
	"accents": {
		"hat": {a: 1, v: 0},
		"bar": {a: 1, v: 0},
		"dot": {a: 1, v: 0},
		"ddot": {a: 1, v: 0},
		"vec": {a: 1, v: 0},
		"overline": {a: 1, v: 0},
		"underline": {a: 1, v: 0}
	},
	"delimiters": {
		"\\|": {a: 1, v: "|"},
		"\\b": {a: 1, v: "backslash"},
		"ceil": {a: 1, v: "lfunc arg \\rfunc"},
		"floor": {a: 1, v: "left\\lfunc arg \\right\\rfunc"},
		"group": {a: 1, v: "left\\lfunc arg \\right\\rfunc"},
		"brack": {a: 1, v: "left\\lfunc arg \\right\\rfunc"},
		"brace": {a: 1, v: "left\\lfunc arg \\right\\rfunc"},
		"ucorner": {a: 1, v: "left\\ulcorner arg \\right\\urcorner"},
		"lcorner": {a: 1, v: "left\\llcorner arg \\right\\lrcorner"},
		"moustache": {a: 1, v: "left\\lfunc arg \\right\\rfunc"},
		"uparrow": {a: 1, v: 0},
		"downarrow": {a: 1, v: 0},
		"updownarrow": {a: 1, v: 0},
		"Downarrow": {a: 1, v: 0},
		"Updownarrow": {a: 1, v: 0}
	},
	"environments": {
		"matrix": {a: 1, v: 2},
		"pmatrix": {a: 1, v: 2},
		"vmatrix": {a: 1, v: 2},
		"Bmatrix": {a: 1, v: 2},
		"bmatrix": {a: 1, v: 2},
		"Vmatrix": {a: 1, v: 2},
		"array": {a: 1, v: 3},
		"darray": {a: 1, v: 3},
		"aligned": {a: 1, v: 4},
		"gathered": {a: 1, v: 4},
		"cases": {a: 1, v: 4},
		"dcases": {a: 1, v: 4}
	},
	"letters": {
		"Gamma": {v: 0},
		"Delta": {v: 0},
		"Theta": {v: 0},
		"Lambda": {v: 0},
		"Xi": {v: 0},
		"Pi": {v: 0},
		"Sigma": {v: 0},
		"Upsilon": {v: 0},
		"Phi": {v: 0},
		"Psi": {v: 0},
		"Omega": {v: 0},
		"alpha": {v: 0},
		"beta": {v: 0},
		"gamma": {v: 0},
		"delta": {v: 0},
		"epsilon": {v: 0},
		"zeta": {v: 0},
		"eta": {v: 0},
		"theta": {v: 0},
		"iota": {v: 0},
		"kappa": {v: 0},
		"lambda": {v: 0},
		"mu": {v: 0},
		"nu": {v: 0},
		"xi": {v: 0},
		"omicron": {v: 0},
		"pi": {v: 0},
		"rho": {v: 0},
		"sigma": {v: 0},
		"tau": {v: 0},
		"upsilon": {v: 0},
		"phi": {v: 0},
		"chi": {v: 0},
		"psi": {v: 0},
		"omega": {v: 0},
		"varepsilon": {v: 0},
		"varkappa": {v: 0},
		"vartheta": {v: 0},
		"varpi": {v: 0},
		"varrho": {v: 0},
		"varsigma": {v: 0},
		"varphi": {v: 0},
		"digamma": {v: 0},
		"imath": {v: 0},
		"jmath": {v: 0},
		"aleph": {v: 0},
		"beth": {v: 0},
		"gimel": {v: 0},
		"daleth": {v: 0},
		"eth": {v: 0},
		"Finv": {v: 0},
		"Game": {v: 0},
		"ell": {v: 0},
		"hbar": {v: 0},
		"hslash": {v: 0},
		"Im": {v: 0},
		"Re": {v: 0},
		"wp": {v: 0},
		"partial": {v: 0},
		"nabla": {v: 0},
		"Bbbk": {v: 0},
		"infty": {v: 0}
	},
	"annotation": {
		"cancel": {a: 1, v: 0},
		"bcancel": {a: 1, v: 0},
		"xcancel": {a: 1, v: 0},
		"sout": {a: 1, v: 0},
		"overbrace": {a: 1, v: 0},
		"underbrace": {a: 1, v: 0},
		"boxed": {a: 1, v: 0}
	},
	"overlap": {
		"llap": {a: 1, v: 0},
		"rlap": {a: 1, v: "func{args0}{args2}"}
	},
	"spacing": {
		"enspace": {a: 1, v: 0},
		"qquad": {a: 1, v: 0},
		"space": {a: 1, v: 0},
		"phantom": {a: 1, v: 0},
		"kern": {a: 1, v: 0},
		"stackrel": {a: 1, v: "func{args0}{args1}"},
		"overset": {a: 1, v: "func{args0}{args1}"},
		"underset": {a: 1, v: "func{args0}{args1}"},
		"atop": {a: 1, v: 0}
	},
	"logic": {
		"forall": {v: 0},
		"exists": {v: 0},
		"nexists": {v: 0},
		"in": {v: 0},
		"notin": {v: 0},
		"nin": {v: "notin"},
		"ni": {v: 0},
		"complement": {v: 0},
		"subset": {v: 0},
		"supset": {v: 0},
		"mid": {v: 0},
		"land": {v: 0},
		"lor": {v: 0},
		"therefore": {v: 0},
		"because": {v: 0},
		"mapsto": {v: 0},
		"to": {v: 0},
		"gets": {v: 0},
		"leftrightarrow": {v: 0},
		"neg": {v: 0},
		"lnot": {v: 0},
		"implies": {v: 0},
		"impliedby": {v: 0},
		"iff": {v: 0}
	},
	"set": {
		"emptyset": {v: 0},
		"varnothing": {v: 0},
		"\\N": {v: "mathbb{N}"},
		"\\Z": {v: "mathbb{Z}"},
		"\\Q": {v: "mathbb{Q}"},
		"\\A": {v: "mathbb{A}"},
		"\\R": {v: "mathbb{R}"},
		"\\C": {v: "mathbb{C}"},
		"\\H": {v: "mathbb{H}"},
		"\\O": {v: "mathbb{O}"},
		"\\S": {v: "mathbb{S}"}
	},
	"bigOperators": {
		"sum": {a: 1, v: "func_{args0}^{args1}"},
		"int": {a: 1, v: "func_{args0}^{args1}"},
		"iint": {a: 1, v: "func_{args0}^{args1}"},
		"iiint": {a: 1, v: "func_{args0}^{args1}"},
		"oint": {a: 1, v: "func_{args0}^{args1}"},
		"intop": {a: 1, v: "func_{args0}^{args1}"},
		"smallint": {a: 1, v: "func_{args0}^{args1}"},
		"prod": {a: 1, v: "func_{args0}^{args1}"},
		"coprod": {a: 1, v: "func_{args0}^{args1}"},
		"bigvee": {a: 1, v: "func_{args0}^{args1}"},
		"bigwedge": {a: 1, v: "func_{args0}^{args1}"},
		"bigcap": {a: 1, v: "func_{args0}^{args1}"},
		"bigcup": {a: 1, v: "func_{args0}^{args1}"},
		"bigsqcup": {a: 1, v: "func_{args0}^{args1}"},
		"bigotimes": {a: 1, v: "func_{args0}^{args1}"},
		"bigoplus": {a: 1, v: "func_{args0}^{args1}"},
		"bigodot": {a: 1, v: "func_{args0}^{args1}"},
		"biguplus": {a: 1, v: "func_{args0}^{args1}"}
	},
	"binOperators": {
		"mod": {a: 0, v: 0},
		"bmod": {a: 0, v: 0}
	},
	"binomialCoefficients": {
		"binom": {a: 1, v: "func{args0}{args1}"},
		"choose": {a: 1, v: 0},
		"dbinom": {a: 1, v: "func{args0}{args1}"},
		"tbinom": {a: 1, v: "func{args0}{args1}"}
	},
	"operators": {
		"pm": {v: 0},
		"mp": {v: 0},
		"times": {v: 0},
		"arcsin": {v: 0},
		"arccos": {v: 0},
		"arctan": {v: 0},
		"arctg": {v: 0},
		"arcctg": {v: 0},
		"arg": {v: 0},
		"ch": {v: 0},
		"cos": {v: 0},
		"cosec": {v: 0},
		"cosh": {v: 0},
		"cot": {v: 0},
		"cotg": {v: 0},
		"coth": {v: 0},
		"csc": {v: 0},
		"ctg": {v: 0},
		"cth": {v: 0},
		"deg": {v: 0},
		"dim": {v: 0},
		"exp": {v: 0},
		"hom": {v: 0},
		"ker": {v: 0},
		"lg": {v: 0},
		"ln": {v: 0},
		"sec": {v: 0},
		"sin": {v: 0},
		"sinh": {v: 0},
		"sh": {v: 0},
		"tan": {v: 0},
		"tanh": {v: 0},
		"tg": {v: 0},
		"th": {v: 0},
		"sqrt": {a: 1, v: "func[args1]{args0}"},
		"log": {a: 1, v: "func_{args0}"},
		"det": {a: 1, v: "func_{args0}"},
		"gcd": {a: 1, v: "func_{args0}"},
		"inf": {a: 1, v: "func_{args0}"},
		"lim": {a: 1, v: "func_{args0}"},
		"liminf": {a: 1, v: "func_{args0}"},
		"limsup": {a: 1, v: "func_{args0}"},
		"max": {a: 1, v: "func_{args0}"},
		"min": {a: 1, v: "func_{args0}"},
		"Pr": {a: 1, v: "func_{args0}"},
		"sup": {a: 1, v: "func_{args0}"}
	},
	"relations": {
		"==": {v: "equiv"},
		"equiv": {v: 0},
		"~=": {v: "approx"},
		"approx": {v: 0},
		"approxeq": {v: 0},
		"asymp": {v: 0},
		"between": {v: 0},
		"<=": {v: "leq"},
		"leq": {v: 0},
		"=>": {v: "geq"},
		"geq": {v: 0},
		"owns": {v: 0},
		"parallel": {v: 0},
		"perp": {v: 0},
		"!=": {v: "neq"},
		"neq": {v: 0},
		"nparallel": {v: 0}
	},
	"extensibleArrows": {
		"xrightarrow": {a: 1, v: "func[args1]{args0}"},
		"xleftarrow": {a: 1, v: "func[args1]{args0}"},
		"xleftrightarrow": {a: 1, v: "func[args1]{args0}"}
	},
	"color": {
		"color": {a: 1, v: 1},
		"textcolor": {a: 1, v: 0}
	},
	"font": {
		"mathrm": {a: 1, v: 0},
		"textrm": {a: 1, v: 0},
		"rm": {a: 1, v: 0}
	},
	"size": {
		"Huge": {v: 0},
		"huge ": {v: 0},
		"LARGE": {v: 0},
		"Large": {v: 0},
		"large": {v: 0},
		"normalsize": {v: 0},
		"small": {v: 0},
		"footnotesize": {v: 0},
		"scriptsize": {v: 0},
		"tiny": {v: 0		}
	},
	"style": {
		"displaystyle": {a: 1, v: 0},
		"textstyle": {a: 1, v: 0},
		"scriptstyle": {a: 1, v: 0},
		"scriptscriptstyle": {a: 1, v: 0},
		"text": {a: 1, v: 1},
		"textnormal": {a: 1, v: 1}
	},
	"symbols": {
		"cdots": {v: 0},
		"ddots": {v: 0},
		"ldots": {v: 0},
		"vdots": {v: 0},
		"angle": {v: 0},
		"measuredangle": {v: 0},
		"sphericalangle": {v: 0},
		"checkmark": {v: 0},
		"diagdown": {v: 0},
		"diagup": {v: 0}
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

    /* Create a new Array containing only functions, which may be in the Expression */
    let possibleFunctions = functionsSorted.filter((func) => {
        return exp.indexOf(func) > -1;
    });

    /* Main Loop for Tokenizing
      Label for continue in first inner loop */
    loop1:
    for(let i = 0; i < exp.length; i++) {
        let tokenLength = tokens.length;
        let lastToken = tokenLength - 1;

        /* Tests if the Expression beginning at Index is equal to a possible Function
           If it is a function, parse it and continue after the function, with
           the length of the function returned by parseFunction */
        let expI = exp.substring(i);

        for(let j = 0; j < possibleFunctions.length; j++) {
            if(expI.indexOf(possibleFunctions[j]) == 0) {
                let ans = parseFunction(expI, possibleFunctions[j]);

                i += ans.l;

                if(!createNewToken) {
                    tokens[lastToken] += ans.t;
                } else {
                    tokens.push(ans.t);
                }

                createNewToken = false;

                continue loop1;
            }
        }

        /* If theres a opening parenthesis, get content and add parsed to tokens,
           unless it begins with "\l" */
        if(isOpeningParenthesis(exp[i])) {
            let ans = getParentheseInterior(expI);
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

    /* Write the Tokens to the Output String
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

/* Takes an Expression starting at the function and the function,
   returns the the length of the parsed Function and the parsed Function */
function parseFunction(exp, func) {
    let i = func.length;

    let token;
    let arg = "";
    let args = [];

    /* If the Function takes Arguments, check for Parentheses and split the Arguments
       Increase the index by the length of the Arguments */
    if(functions[func].a == 1 && isOpeningParenthesis(exp[i])) {
        let interior = getParentheseInterior(exp.substring(i));
        i += interior.i + 1;

        arg = interior.content;
        args = splitArgs(arg);
    }

	let parsedArg = parseExpression(arg)

    if(functions[func].v == 0) {
        token = "\\" + func + "{" + parsedArg + "} "
		if(parsedArg == "") {
			token = "\\" + func + parsedArg
		}
    } else if(functions[func].v == 1) {
        token = "\\" + func + "{" + arg + "} "
    } else if(functions[func].v == 2) {
        token = "\\begin{" + func + "}" + parseExpression(arg, true, true) + "\\end{" + func + "}"
    } else if(functions[func].v == 3) {
        token = "\\begin{" + func + "}{" + args[0] + "}" + parseExpression(args[1], true) + "\\end{" + func + "}"
    } else if(functions[func].v == 4) {
        token = "\\begin{" + func + "}" + parseExpression(arg, true) + "\\end{" + func + "}"
    } else {
        token = "\\" + functions[func].v.replace(/func/g, func).replace(/arg(s[0-9]+|)/g, (a, b) => {
            if(b != "") {
                return parseExpression(args[b.substring(1)])
            } else {
                return parsedArg
            }
        }) + " "
    }

    return {
        l : i - 1,
        t : token
    }
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
    return /[^0-9a-z!°]/i.test(exp);
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