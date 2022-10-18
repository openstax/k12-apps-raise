# Styling content for RAISE

In order to maintain consistency and reliability across all RAISE content, the styling associated with RAISE content is consolidated into a series of css classes located in `src/styles`. 

RAISE Style classes are either written for specific elements, or can be applied to a variety of objects. Those differences are listed below. Content Developers 

## Styling Classes 

### Gray Box (os-raise-graybox)
Add a Gray box around your element
**Example**

**Aviliability**
Any top level element: ie, an interactive block, paragraph, or div element.
**Usage** 
```html 
<p class="os-raise-graybox">Text in a box</p>
```
```html
<div class="os-raise-graybox">
    <p> Image Title</p>
    <img src="www.link.com"></img>
</div>
```