# Styling content for RAISE

In order to maintain consistency and reliability across all RAISE content, the styling associated with RAISE content is consolidated into a series of css classes located in `src/styles`.

RAISE Style classes are either written for specific elements, or can be applied to a variety of objects. Those differences are listed below.

***

## Style Classes 

### Standard Table 

Add a border of `1px solid black` and padding of `5px` to your table.

**Example**
<div style="text-align: left;">
    <img src="./static/table.png" width="300">
</div>


**Aviliability**
Add as a class atribute to a table html tag. 

**Usage** 

```html
  <table class="os-raise-standardtable">
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
</table>
```

### Indent (os-raise-indent)

Add a padding to the left side of an element. If the element already includes a left padding (like an ordered list) the indent will get set to exactly 2rem

**Availability**

Any element

**Usage**

```html 
<p class="os-raise-indent">Text in a box</p>
```

### No-Indent (os-raise-noindent)

Remove the indent inherent in an ordered list. 

**Availability**

Ordered list objects

**Usage**

```html
<ol class="os-raise-noindent">
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
</ol>
```
