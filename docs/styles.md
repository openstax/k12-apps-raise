# Styling content for RAISE

In order to maintain consistency and reliability across all RAISE content, the styling associated with RAISE content is consolidated into a series of css classes located in `src/styles`. 

RAISE Style classes are either written for specific elements, or can be applied to a variety of objects. Those differences are listed below.

## Style Classes 

### Indent (os-raise-indent)

Add a padding to the left side of an element. If the element already includes a left padding (like an ordered list) the indent will get set to exactly 2rem

**Availibility**

Any element

**Usage**

```html 
<p class="os-raise-indent">Text in a box</p>
```

### No-Indent (os-raise-noindent)

Remove the indent inherent in an ordered list. 

**Avilibility**

Ordered list objects

**Usage**

```html
<ol class="os-raise-noindent">
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
</ol>
```
