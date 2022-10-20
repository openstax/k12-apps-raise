# Styling content for RAISE

In order to maintain consistency and reliability across all RAISE content, the styling associated with RAISE content is consolidated into a series of css classes located in `src/styles`.

RAISE Style classes are either written for specific elements, or can be applied to a variety of objects. Those differences are listed below.

***

## Standard Table 

Add a border of `1px solid black` and padding of `5px` to your table.

**Example**
<div style="text-align: left;">
    <img src="./static/table.png" width="300">
</div>


**Aviliability**
Add as a class to a table html tag. 

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
