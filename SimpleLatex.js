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
SimpleLatex.parse("matrix(1 2 3\n 4 5 6\\ 7 8 9)") // -> \begin{vmatrix}1&2&3\\4&5&6\\7&8&9\end{vmatrix}
SimpleLatex.parse("1/2 + (\l3/4)") -> \frac{1}{2} + 3/4

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
/* Default Replacements for functions, referenced by Index in this Array

   "func" will be replaced by the functionName

   "arg" will be replaced by the complete arg
   "argsI" will be replaced by the Ith arg

	adding "p"s after "arg" or between "args" and "I"
	1p: will be parsed by parseExpression(exp)
	2p: will be parsed by parseExpression(exp, true)
	3p: will be parsed by parseExpression(exp, true, true)
*/
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
	"\\func{(argp)}"
];

/* {functionName : replacement || replacementDefault, ...} */
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
		"arcsin": 11,
		"arccos": 11,
		"arctan": 11,
		"arctg": 11,
		"arcctg": 11,
		"arg": 11,
		"ch": 11,
		"cos": 11,
		"cosec": 11,
		"cosh": 11,
		"cot": 11,
		"cotg": 11,
		"coth": 11,
		"csc": 11,
		"ctg": 11,
		"cth": 11,
		"deg": 11,
		"dim": 11,
		"exp": 11,
		"hom": 11,
		"ker": 11,
		"lg": 11,
		"ln": 11,
		"sec": 11,
		"sin": 11,
		"sinh": 11,
		"sh": 11,
		"tan": 11,
		"tanh": 11,
		"tg": 11,
		"th": 11,
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
		"%": "\\%",
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
let functionsSorted = Object.keys(functions).sort((a, b) => {
	return b.length - a.length;
});

/* Main function (gets called if using SimpleLatex.parse)
   Tokenizes the Expression (exp), evaluates the Tokens and joins
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

	/* Remove whitespace at the beginning and the end */
	exp = exp.trim();

    /* If Expression begins with "\l" return unparsed */
    if(exp.indexOf("\\l") == 0) {
        return exp.substring(2);
    }

	/* If in Array or Matrix Environment, replace
		"\n" by "\\" and
		" " by "&" without doing both */
	if(arrayEnv) {
		if(andMatrixEnv) {
			exp = exp.replace(/ *(\n|\\\\)+ */g, "\\\\")
			exp = exp.replace(/([^\\]) +(?!\\)/g, "$1&")
		} else {
			exp = exp.replace(/(\n|\\\\)+/g, "\\\\")
		}

	}

    let tokens = [];
    let out = "";

    /* Tokenize */
    for(let i = 0; i < exp.length; i++) {
		let end = tokens.length - 1;
		let lastToken = tokens[end];
		let char = exp[i];

		/* If the current part ist one of these special functions, parse them now,
		   because otherwise the tokenizing will destroy them
		   (e.g. "\\b" -> "\\", "b") */
		if(["\\b", "\\N", "\\Z", "\\Q", "\\A", "\\R", "\\C", "\\H", "\\O", "\\S",
				"==", "~=", "<=", "=>", "!="].indexOf(char + exp[i + 1]) > -1
				|| ["%", "°", "!"].indexOf(char) > -1) {
			if(["°", "!"].indexOf(char) > -1 && isAlphaNumeric(lastToken)) {
				tokens[end] += char == "!" ? "!" : functions[char];
			} else if(["%", "°", "!"].indexOf(char) > -1) {
				tokens.push(char == "!" ? "!" : functions[char]);
			} else {
				tokens.push(functions[char + exp[i + 1]]);
				i++;
			}

			continue;
		}

		/* If the current part is of the same type, append, otherwise, create new
		   token */
		if(isAlphaNumeric(lastToken) && isAlphaNumeric(char)) {
			tokens[end] += char;
		} else {
			/* If theres a Parenthese add everything in Parenthese (including
			   Parenthese) as one Token to the tokens */
			if(isOpeningParenthesis(char)) {
				let ans = getParenthese(exp.substring(i));
	            i += ans.length - 1;

				tokens.push(ans)
			} else {
				tokens.push(char);
			}
		}
    }
console.log(tokens)
	/* Parse Tokens for functions */
	for(let i = 0; i < tokens.length; i++) {
		let tok = tokens[i];

		if(!isAlphaNumeric(tok)) {
			continue
		}

		/* Call parseFunction with current Token, give next Token as argument for
		   possible function in current Token */
		let ans = parseFunction(tokens[i], tokens[i + 1]);

		tokens[i] = ans.val;

		/* If the given argument was used, remove its token */
		if(ans.arg) {
			tokens.splice(i + 1, 1)
		}
	}

	/* Parse everything in Parentheses and merge Letters and Numbers */
	for(let i = 0; i < tokens.length; i++) {
		let t = tokens[i];

		if(isInParenthese(t)) {
			if(t.indexOf("\\l") == 1) {
				tokens[i] = stripParenthese(t).substring(2)
			} else {
				tokens[i] = t[0] + parseExpression(stripParenthese(t)) + t[t.length - 1]
			}
		}

		while(isAlphaNumeric(tokens[i]) && isAlphaNumeric(tokens[i + 1])) {
			tokens[i] = tokens[i] + tokens[i + 1];
			tokens.splice(i + 1, 1);
		}
	}

    /* Loop backwards through the Tokens (so that this can handle stacked Expressions
	   like 1^2^3 or a_b_c) and group the Tokens into one
       If the Token after the "^" or "_" is a "-", then take the Token after the Minus too
       If the base contains Parentheses, keep them (and add the Latex Code for size adjusting),
       if the exponent contains Parentheses, remove them (not necessary to show, due to superposition) */
    for(let i = tokens.length - 1; i > 0; i--) {
        if(tokens[i] == "^" || tokens[i] == "_") {
            let beginsWithMinus = tokens[i + 1] == "-" ? 2 : 1;

        	tokens[i - 1] = adjustParenthese(tokens[i - 1]) + tokens[i] + "{" +
				(beginsWithMinus == 2 ? "-" : "") +
				stripParenthese(tokens[i +beginsWithMinus]) + "}";

			tokens.splice(i, 1 + beginsWithMinus);

            i -= beginsWithMinus;
        }
    }

    /* Loop forwards through the Tokens (so that this can handle stacked Expressions
	   like 1/2/3) and group the Tokens into one, adding the Latex Code for a Fraction
       If the Token after the "^" or "_" is a "-", then take the Token after the Minus too
       If the numerator or denominator contains Parentheses, remove them
	   (not necessary to show, due to Fraction Sign) */
    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] == "/") {
            let beginsWithMinus = tokens[i + 1] == "-" ? 2 : 1;

        	tokens[i - 1] = "\\frac{" + stripParenthese(tokens[i - 1]) + "}{" +
				(beginsWithMinus == 2 ? "-" : "") +
				stripParenthese(tokens[i + beginsWithMinus]) + "}";

            tokens.splice(i, 1 + beginsWithMinus);

            i -= beginsWithMinus;
        }
    }

    /* Write the Tokens to the output String
       If there are Parentheses keep them (and add the Latex Code for size adjusting),
       unless parsing a Matrix Environment, then remove them */
    for(let i = 0; i < tokens.length; i++) {
		let t = tokens[i];

        if(andMatrixEnv) {
			out += stripParenthese(t);
        } else {
            out += adjustParenthese(t);
        }
    }

    return out;
}

/* Takes a token, possible args and returns an object {val, arg} where val is
   the parsed token and arg a Bool, whether the argument was used */
function parseFunction(token = "", arg = "") {
	if(token.length == 0) {
		return {val : "", arg : false}
	}

	/* If token is an exact match for a function, set func = token */
	let func = functions[token] != null ? token : null;

	/* Else search token for functions, splitting the token in 3 parts:
	   	pre:  everything before the first function, which is just appended
		func: the first function, which will be parsed
		post: everything after the first function, which is parsed as a function
		      afterwards

		If post is empty, the arg will be used for the func, otherwise for the
		last func in post (because thats the function directly before the arg)
	*/
	let pre = "";
	let post = "";
	if(func == null) {
		/* Loop through the token as long there is no func */
		for(let j = 0; func == null && j < token.length; j++) {
			/* Reduce the length of the slice as long as there is no func
			   and as long the slice is positive */
			for(let k = token.length; func == null && k > j; k--) {
				pre = token.slice(0, j);
				let slice = token.slice(j, k);
				post = token.slice(k, token.length);

				/* Check if the slice is a direct match, if yes, stop the search
				   cause the function is found */
				if(functionsSorted.indexOf(slice) > -1) {
					func = slice;
				/* Otherwise check if the slice is a part of a function.
				   If there is another possible function, discard the result,
				   cause of the ambiguity */
			    } else if(k - j > 2) {
					for(let l = 0; l < functionsSorted.length; l++) {
					 	if(functionsSorted[l].indexOf(slice) == 0) {
							if(func != null) {
								func = "";
								break;
							}
							func = functionsSorted[l];
						}
					}
				}
			}
		}

		/* Check if there is no or only an an ambiguous function. If yes, return
		   token as is */
		if(func == null || func == "") {
			return {val : token, arg : false};
		}
	}

	/* If there is no possible following function and the arg is an argument (),
	   return the pre and the parsed func with the stripped arg,
	   else return the pre and the parsed func without the arg and parse the post,
	   with the arg */
	if(post == "" && isInParenthese(arg)) {
		let ans = replaceFunction(func, stripParenthese(arg));
		return {val : pre + ans.val, arg : ans.arg};
	} else {
		let ans = parseFunction(post, arg);
		return {val : pre + replaceFunction(func).val + ans.val, arg : ans.arg};
	}
}

/* Takes a function and an optional argument and returns the parsed Function
   and a Bool, whethet the arg was used */
function replaceFunction(func, arg = "") {
	if(functions[functions[func]] != null) {
		func = functions[func]
	}

	let rep = functions[func];

	if(Number.isInteger(rep)) {
		rep = replacements[rep];
	}

	rep = rep.replace(/func/g, func);

	let usesArg = rep.indexOf("arg") > -1;

	if(usesArg) {
		let args = splitArgs(arg);

		rep = rep.replace(/arg(s{0,1})(p*)([0-9]*)/g, (a, b, c, d) => {
			a = b == "s" ? args[d] : arg;
			if(c.length == 3) {return parseExpression(a, true, true)}
			if(c.length == 2) {return parseExpression(a, true)}
			if(c.length == 1) {return parseExpression(a)}
			if(c.length == 0) {return a || ""}
			return ""
		});
	}

	return {val : rep, arg : usesArg};
}

function isAlphaNumeric(exp = "") {
	return /^[0-9a-z,.]+$/gi.test(exp)
}

/* Takes an Expression and returns the Arguments, splitten by ","
   regards Parentheses */
function splitArgs(exp) {
    let args = [];
    let parentheses = 0;
    let temp = "";

    for(let i = 0; i < exp.length; i++) {
        if(isOpeningParenthesis(exp[i])) {
            let ans = getParenthese(exp.substring(i));
            i += ans.length - 1;
            temp += ans;
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

let matchingParentheses = {
	"(" : ")",
	"[" : "]",
	"{" : "}",
};

function isOpeningParenthesis(exp) {
	return matchingParentheses[exp] != null;
}

function isInParenthese(exp = "") {
	let f = exp[0];
	let l = exp[exp.length - 1];
	return isOpeningParenthesis(f) && l == matchingParentheses[f];
}

/* Takes an Expression starting at a Parenthese and returns content of the
   Parenthese (including the Parenthese)*/
function getParenthese(exp) {
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

    return openingParenthesis + content + closingParenthesis
}

/* If Expression starts with (and ends with matching) Parentheses,
   remove them, leaving only the Interior */
function stripParenthese(exp = "") {
    let end = exp.length - 1;

    if(isInParenthese(exp)) {
        exp = exp.substring(1, end);
    }

    return exp;
}

/* If Expression starts with (and ends with matching) Parentheses,
   add the Latex Code for size adjusting ("\left" and "\right") before the Parentheses */
function adjustParenthese(exp = "") {
    let end = exp.length - 1;

    if(isInParenthese(exp)) {
        exp = "\\left" + (exp[0] == "{" ? "\\" : "") + exp.substring(0, end) +
			"\\right" + (exp[end] == "}" ? "\\" : "") + exp[end];
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