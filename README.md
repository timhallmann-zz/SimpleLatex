# SimpleLatex

SimpleLatex provides an slightly easier way for writing mathematical Expressions
in LaTeX.

## Usage

Simply call the function `SimpleLatex.parse` with the Expression you want to parse and
it returns the LaTeX-Code.

```js
SimpleLatex.parse("1/23/4^5^67") // -> \frac{\frac{1}{23}}{4^{5^{67}}}
SimpleLatex.parse("int(a,b)e^x dx") // -> \int_{a}^{b}e^{x} dx
SimpleLatex.parse("matrix(1 2 3\n 4 5 6\n 7 8 9)") // -> \begin{vmatrix}1&2&3\\4&5&6\\7&8&9\end{vmatrix}

// If you dont want to parse some part of the Expression, write it like this (\l exp)
SimpleLatex.parse("1/2 + (\l 3/4)") // -> \frac{1}{2} + 3/4
```

You can access the provided functions by topic, in an Array sorted by length or get them all

```js
SimpleLatex.functionsByTopic // -> Object {"topic" : {functionName : value, ...}, ...}
SimpleLatex.functionsSorted // -> Array [functionName, ...] (sorted by length of functionName, long to short)
SimpleLatex.functions // -> Object {functionName : value, ...}
```

## Demo

Try the demo at https://timhallmann.github.io/SimpleLatex/

## License

SimpleLatex is under the MIT License (see License File)