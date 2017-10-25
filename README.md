# SimpleLatex

SimpleLatex provides an slightly easier way for writing mathematical Expressions
in LaTeX.

## Usage

Simply call the function `SimpleLatex` with the Expression you want to parse and
it returns the LaTeX-Expression.

```js
SimpleLatex("1/23/4^5^67") // -> \frac{\frac{1}{23}}{4^{5^{67}}}
SimpleLatex("int(a,b)e^x dx") // -> \int_{a}^{b}e^{x} dx
SimpleLatex("matrix(1 2 3\n 4 5 6\n 7 8 9)") // -> \begin{vmatrix}1&2&3\\4&5&6\\7&8&9\end{vmatrix}
```

## License

SimpleLatex is under the MIT License (see License File)