# Table of Contents

- Purpose behind this markdown
  - [Styling Content for RAISE](#styling-content-for-raise)
- Tables
  - [Text Heavy Tables](#text-heavy-table)
  - [Text Heavy Adjusted Tables](#text-heavy-adjusted-table)
  - [Horizontal Tables](#horizontal-table)
  - [Mid-Sized Tables](#mid-size-table)
  - Skinny Tables
    - [Skinny Table w/Media](#skinny-table-table--media)
    - [Three Skinny Tables](#skinny-table-three-tables)
  - Wide Tables
    - [Equal Column Wide Tables](#wide-equal-column-table)
    - [Adjustable Column Wide Tables](#wide-adjusted-table)
  * [Double Header Tables](#double-header-table)
* Spacing
  - Margin
    - [No Bottom Margin](#no-margin-bottom-os-raise-mb-0)
    - [Center w/Auto Margin](#margin-auto-os-raise-mx-auto)
  - Indentation
    - [Indent](#indent-os-raise-indent)
    - [No Indent](#no-indent-os-raise-noindent)
  - Text Centering
    - [Center Text Horizontally](#centered-text-os-raise-text-center)
* Layout
  - Flex
    - Initialization of Flex Box
      - [Initializing Flexbox](#initializing-flexbox-os-raise-d-flex-nowrap--os-raise-d-flex)
    - Content Positioning
      - [Center Side-by-Side Content Vertically](#center-side-by-side-content-vertically)
      - [Center Side-by-Side Content Horizontally](#center-side-by-side-content-horizontally)
      - [Add Space Between Side-by-Side Content](#add-space-between-side-by-side)
      - [Add Space Equally Around Side-by-Side Content](#add-space-equally-around-side-by-side-content)
    - Content Spacing
      - [Add 16px of Space Between Content](#add-16px-of-space-between-content)
      - [Add 32px of Space Between Content](#add-32px-of-space-between-content)
* Components
  - [Gray Box](#gray-box-os-raise-graybox)
  - [Motivational Message](#motivational-content-os-raise-motivation)
  - [Extra Support Box](#extra-support-box)
  - [Accordion](#accordion-os-raise-accordion)
  - [Student Reflection Box](#student-reflection-box)
  - [Family Support Materials Links](#family-support-materials-links)
* Text Styling
  - [Bold Text](#bold-text)
  - [Italicize Text](#italicize-text)
* Media Styling
  - [Responsive Media](#responsive-media)
  - [Responsive iframe](#responsive-iframe)

# Styling Content for RAISE

In order to maintain consistency and reliability across all RAISE content, the styling associated with RAISE content is consolidated into a series of css classes located in `src/styles`. RAISE Style classes are either written for specific elements, or can be applied to a variety of objects. Those differences are listed below.

---

## Text Heavy Table

Adds a solid border, styled table header, and padding to a fixed-width table that contains multi-line text.

**Example**

<div style="text-align: center;">
    <img src="./static/textheavytable.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-textheavytable">
  <caption> Texas Essential Knowledge and Skills (TEKS)
  <thead>
    <tr>
      <th scope="col">TEKS</th>
      <th scope="col">Explanation of Coverage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>A11(B) simplfy numeric and algebraic expressions using the laws of exponents, including integral and rational exponents</p>
      </td>
      <td>
        <p>Partial coverage: Lesson provides content that covers part of this TEKS. The parts that are covered have been underlined</p>
      </td>
    </tr>
  </tbody>
</table>
```

---

## Text Heavy Adjusted Table

Adds a solid border, styled table header, and padding to a table with column widths determined by the widest content in a column.

**Example**

<div style="text-align: center;">
    <img src="./static/textheavyadjustedtable.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-textheavyadjustedtable">
  <thead>
    <tr>
      <th scope="col">Lesson Number</th>
      <th scope="col">Lesson Title</th>
      <th scope="col">Associated Texas Essential Knowledge and Skills [TEKS]</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.1</td>
      <td>Exploring Expressions and Equations</td>
      <td><p>A1(A) apply mathematics to problems arising in everyday life, society, and the workplace</p>
        <p>A2(C) write linear equations in two variables given a table of values, a graph, and a verbal description</p></td>
    </tr>
    <tr>
      <td>1.2</td>
      <td>Writing Equations to Model Relationships (Part 1)</td>
      <td><p>A1(A) apply mathematics to problems arising in everyday life, society, and the workplace</p>
        <p>A2(C) write linear equations in two variables given a table of values, a graph, and a verbal description</p></td>
    </tr>
    <tr>
      <td>1.3</td>
      <td>Writing Equations to Model Relationships (Part 2)</td>
      <td><p>A1(A) apply mathematics to problems arising in everyday life, society, and the workplace</p>
        <p>A1(C) select tools, including real objects, manipulatives, paper and pencil, and technology as appropriate, and techniques, including mental math, estimation, and number sense as appropriate, to solve problems</p>
        <p>A2(C) write linear equations in two variables given a table of values, a graph, and a verbal description.</p></td>
    </tr>
    <tr>
      <td>1.4</td>
      <td>Equations and Their Solutions</td>
      <td><p>A1(A) apply mathematics to problems arising in everyday life, society, and the workplace</p>
        <p>A1(C) select tools, including real objects, manipulatives, paper and pencil, and technology as appropriate, and techniques, including mental math, estimation, and number sense as appropriate, to solve problems</p>
        <p>A2(C) write linear equations in two variables given a table of values, a graph, and a verbal description</p></td>
    </tr>
  </tbody>
</table>
```

---

## Horizontal Table

Adds a solid border, styled header cell, and padding to a horizontal table.

**Example**

<div style="text-align: center;">
    <img src="./static/horizontaltable.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-horizontaltable">
  <thead></thead>
  <tbody>
    <tr>
      <th scope="row">Time (years)</th>
      <td>5</td>
      <td>1</td>
      <td>0</td>
      <td>-1</td>
      <td>-2</td>
    </tr>
    <tr>
      <th scope="row">Volume of Coral (cubic centimeters)</th>
      <td>a.___</td>
      <td>b.___</td>
      <td>c.___</td>
      <td>d.___</td>
      <td>e.___</td>
    </tr>
  </tbody>
</table>
```

---

## Mid-Size Table

Adds a solid border, styled table header, and padding to a centered, fixed-width, mid-size table.

**Example**

<div style="text-align: center;">
    <img src="./static/midsizetable.png" width="400">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-midsizetable">
  <thead>
    <tr>
      <th scope="col">Hour</th>
      <th scope="col">Number of Bacteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>500</td>
    </tr>
    <tr>
      <td>1</td>
      <td>a.____</td>
    </tr>
    <tr>
      <td>2</td>
      <td>b.____</td>
    </tr>
    <tr>
      <td>3</td>
      <td>c.____</td>
    </tr>
    <tr>
      <td>6</td>
      <td>d.____</td>
    </tr>
    <tr>
      <td>t</td>
      <td>e.____</td>
    </tr>
  </tbody>
</table>
```

---

## Skinny Table (Table + Media)

Adds a solid border, styled table header, and padding to a fixed-width skinny table paired with a image.

**Example**

<div style="text-align: center;">
    <img src="./static/skinnytablewithmedia.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<div class="os-raise-d-flex os-raise-justify-content-between">
  <div class="os-raise-mx-auto">
    <img
      src="https://k12.openstax.org/contents/raise/resources/e58d77d5467431d611f6c3b66b4ae002583c7eab"
      width="450px"
    />
  </div>
  <table class="os-raise-skinnytable">
    <thead>
      <tr>
        <th scope="col">x</th>
        <th scope="col">y</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>0</td>
      </tr>
      <tr>
        <td>2</td>
        <td>5</td>
      </tr>
      <tr>
        <td>3</td>
        <td>10</td>
      </tr>
      <tr>
        <td>4</td>
        <td>15</td>
      </tr>
      <tr>
        <td>5</td>
        <td>20</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Skinny Table (Three Tables)

Adds a solid border, styled table header, and padding to three fixed-width skinny tables.

**Example**

<div style="text-align: center;">
    <img src="./static/threeskinnytables.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<div class="os-raise-d-flex os-raise-justify-content-between">
  <table class="os-raise-skinnytable">
    <thead>
      <tr>
        <th scope="col">x</th>
        <th scope="col">y</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>0</td>
      </tr>
      <tr>
        <td>2</td>
        <td>5</td>
      </tr>
      <tr>
        <td>3</td>
        <td>10</td>
      </tr>
      <tr>
        <td>4</td>
        <td>15</td>
      </tr>
      <tr>
        <td>5</td>
        <td>20</td>
      </tr>
    </tbody>
  </table>
  <table class="os-raise-skinnytable">
    <thead>
      <tr>
        <th scope="col">x</th>
        <th scope="col">y</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>0</td>
      </tr>
      <tr>
        <td>2</td>
        <td>5</td>
      </tr>
      <tr>
        <td>3</td>
        <td>10</td>
      </tr>
      <tr>
        <td>4</td>
        <td>15</td>
      </tr>
      <tr>
        <td>5</td>
        <td>20</td>
      </tr>
    </tbody>
  </table>
  <table class="os-raise-skinnytable">
    <thead>
      <tr>
        <th scope="col">x</th>
        <th scope="col">y</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>0</td>
      </tr>
      <tr>
        <td>2</td>
        <td>5</td>
      </tr>
      <tr>
        <td>3</td>
        <td>10</td>
      </tr>
      <tr>
        <td>4</td>
        <td>15</td>
      </tr>
      <tr>
        <td>5</td>
        <td>20</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Wide Equal Column Table

Adds a solid border, styled table header, and padding to a fixed-width table with equal column width.

**Example**

<div style="text-align: center;">
    <img src="./static/wideequaltable.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-wideequaltable">
  <thead>
    <tr>
      <th scope="col">Expression</th>
      <th scope="col">To multiple like bases, add the exponents.</th>
      <th scope="col">Simplified Result - Simplified Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\(n\)</td>
      <td>\((2)^2\) = \((-2)\)\((-2)\)</td>
      <td>\(2\)</td>
    </tr>
    <tr>
      <td>\(n^2\)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\(n^3\)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\(n^4\)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\(n^5\)</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
```

---

## Wide Adjusted Table

Adds a solid border, styled table header, and padding to a table with column widths determined by the widest content in a column.

**Example**

<div style="text-align: center;">
    <img src="./static/wideadjustedtable.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-wideadjustedtable">
  <thead>
    <tr>
      <th scope="col">Expression</th>
      <th scope="col">To multiple like bases, add the exponents.</th>
      <th scope="col">Simplified Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\(n\)</td>
      <td>\((2)^2\) = \((-2)\)\((-2)\)</td>
      <td>\(2\)</td>
    </tr>
    <tr>
      <td>\(n^2\)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\(n^3\)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\(n^4\)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\(n^5\)</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
```

---

## Double Header Table

Adds a solid border, styled table/cell headers, and padding to a fixed-width table with an empty first column cell.

**Example**

<div style="text-align: center;">
    <img src="./static/doubleheadertable.png" width="600">
</div>

**Availability**

Add as a class attribute to a table html tag.

**Usage**

```html
<table class="os-raise-doubleheadertable">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">\(x\)</th>
      <th scope="col">\(+7\)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">\(x\)</th>
      <td>\(x^2\)</td>
      <td>\(7x\)</td>
    </tr>
    <tr>
      <th scope="row">\(+9\)</th>
      <td>\(9x\)</td>
      <td>\(63\)</td>
    </tr>
  </tbody>
</table>
```

---

## No margin-bottom (os-raise-mb-0)

Remove bottom margin from your element

**Example**

<div style="text-align: center;">
    <img src="./static/nomarginbottom.png" width="300">
</div>

**Availability**

Any element with a default bottom margin

**Usage**

```html
<p>Text with bottom margin</p>
<p class="os-raise-mb-0">Text without bottom margin</p>
<p>Text with bottom margin</p>
```

---

## Margin auto (os-raise-mx-auto)

Horizontally center a block element within its container. The block element will take up the specified width and the remaining space is split equally between the left and right margin.

**Example**

<div style="text-align: center;">
    <img src="./static/marginauto.png" width="300">
</div>

**Availability**

Any child block element with a width smaller than its parent element.

**Usage**

```html
<div>
  <div class="os-raise-mx-auto"></div>
</div>
```

---

## Indent (os-raise-indent)

Add a padding to the left side of an element. If the element already includes a left padding (like an ordered list) the indent will get set to exactly 2rem

**Example**

<div style="text-align: center;">
    <img src="./static/indent.png" width="300">
</div>

**Availability**

Any element

**Usage**

```html
<p class="os-raise-indent">Indented text</p>
```

---

## No-Indent (os-raise-noindent)

Remove the indent inherent in an ordered list.

**Example**

<div style="text-align: center;">
    <img src="./static/noindent.png" width="300">
</div>

**Availability**

Ordered list objects

**Usage**

```html
<ol class="os-raise-noindent">
  <li>Not Indented item 1</li>
  <li>Not Indented item 2</li>
</ol>
```

---

## Gray Box (os-raise-graybox)

Add a Gray box around your element

**Example**

<div style="text-align: center;">
    <img src="./static/graybox.png" width="450">
</div>

**Availability**
Grayboxes should be used in div elements only

**Usage**

```html
<div class="os-raise-graybox">
    <p> Image Title</p>
    <img src="www.link.com"></img>
</div>
```

---

## Motivational Content (os-raise-motivation)

Add a styled motivational message into the content

**Example**

<div style="text-align: center;">
    <img src="./static/motivation.png" width="600">
</div>

**Availability**

Div objects only

**Usage**

```html
<div class="os-raise-motivation">
  <p>You got this! If you believe that you can figure it out you can!</p>
</div>
```

---

## Extra Support Box

Add a styled container and content for support for English Language Learners and students with disabilities.

**Examples**

Support for English Language Learners
<div style="text-align: center;">
    <img src="./static/extrasupportboxell.png" width="750">
</div>

Support for Students with Disabilities
<div style="text-align: center;">
    <img src="./static/extrasupportboxdisabilities.png" width="750">
</div>

**Availability**

Extra support boxes should only be used in `<div>` elements.

**Usage**

Support for English Language Learners
```html
<div class="os-raise-extrasupport">
  <div class="os-raise-extrasupport-header">
    <p class="os-raise-extrasupport-title">Support for English Language Learners</p>
    <p class="os-raise-extrasupport-name">MLR 6 Three Reads: Reading, Listening, Conversing</p>
  </div>
  <div class="os-raise-extrasupport-body">
      <p>
        Ask students to keep their books or devices closed and display only the image with the opening task statement, without revealing the questions that follow.
        Use the first read to orient students to the situation by asking students to describe what the situation is about without using numbers (a teacher buys calculators and measuring tapes for her class).
        Use the second read to identify quantities and relationships; ask students: “What can be counted or measured?”
        Listen for, and amplify, the important quantities that vary in relation to each other in this situation: number of calculators purchased (for each order), number of measuring tapes purchased (for each order), and total cost of each order.
        After the third read, reveal the questions that follow and invite students to brainstorm possible strategies to find the solution to the system.
        This routine helps students interpret the language within a given situation needed to create an equation.
      </p>
      <p class="os-raise-text-italicize">Design Principle(s): Support sense-making</p>
      <p class="os-raise-extrasupport-title">Learn more about this routine</p>
      <p>
        <a href="">View the instructional video</a>
        and
        <a href="">follow along with the materials</a>
        to assist you with learning this routine.
      </p>
  </div>
</div>
```

Support for Students with Disabilities
```html
<div class="os-raise-extrasupport">
  <div class="os-raise-extrasupport-header">
    <p class="os-raise-extrasupport-title">Support for Students with Disabilities</p>
    <p class="os-raise-extrasupport-name">Representation: Internalize Comprehension</p>
  </div>
  <div class="os-raise-extrasupport-body">
      <p>
        Provide appropriate reading accommodations and supports to ensure student access to written directions, word problems, and other text-based content. 
        While reading the situation aloud, explicitly link the word problem to the corresponding algebraic expression. 
        Point to both the sentence and its corresponding equation while reading. Pause in between sentences and reread or repeat gestures if necessary for increased comprehension.
      </p>
      <p class="os-raise-text-italicize">Supports accessibility for: Language; Conceptual processing</p>
  </div>
</div>
```

---
## Accordion (os-raise-accordion)

The Accordion component is designed to showcase content in an expandable and collapsible format, allowing users to view specific sections while keeping the rest hidden.

**Example**

<div style="text-align: center;">
    <img src="./static/accordion_1.png" width="600">
</div>
<div style="text-align: center;">
    <img src="./static/accordion_2.png" width="600">
</div>

**Usage**

The button with the classname `os-raise-accordion-header` is the accordion item header.
The content div with the classname `os-raise-accordion-content` inside each accordion section can include various elements such as text, images, tables, etc. Modify the content as needed to suit your specific requirements. You cannot put interactive blocks inside of an accordion. You should not nest accordions. The header for the accordion item should be kept short.

```html
<div class="os-raise-accordion">
    <!-- Accordion Item 1-->
    <div class="os-raise-accordion-item">
        <button class="os-raise-accordion-header">Accordion Header Text 1</button>
        <div class="os-raise-accordion-content">
            <!-- Content goes here -->
            <p>Content<p>
        </div>
    </div>
    <!-- Accordion Item 2-->
    <div class="os-raise-accordion-item">
        <button class="os-raise-accordion-header">Accordion Header Text 2</button>
        <div class="os-raise-accordion-content">
            <!-- Content goes here -->
            <p>Content<p>

        </div>
    </div>

</div>

```
---


## Student Reflection Box

Add a styled container and content for student reflection.

**Examples**

Student Reflection Box
<div style="text-align: center;">
    <img src="./static/studentreflectionbox.png" width="750">
</div>

Student Reflection Box Side-by-Side
<div style="text-align: center;">
    <img src="./static/studentreflectionboxbc.png" width="750">
</div>

**Availability**

Student reflection boxes should only be used in `<div>` elements.

**Usage**

Student Reflection Box
```html
<div class="os-raise-student-reflection">
  <p class="os-raise-student-reflection-title">Why Should I Care?</p>
  <img src="https://k12.openstax.org/contents/raise/resources/6fa8f58bb147e19048d9ae123f7ba85834cf748d"/>
  <p>Matteo's brother can use algebra to budget his paycheck from his job at a pizza place. He uses some money for food, some for going out with his friends, and some, he saves for college.</p>
  <p>If he uses variables to represent the different ways he uses his money, he can put those variables into an equation to make sure he has enough money to last until his next paycheck.</p>
</div>
```

Student Reflection Box Side-by-Side
```html
<div class="os-raise-student-reflection">
  <p class="os-raise-student-reflection-title">Building Character: Social Intelligence</p>
  <div class="os-raise-d-flex-nowrap os-raise-gap-1">
    <img src="https://k12.openstax.org/contents/raise/resources/6fa8f58bb147e19048d9ae123f7ba85834cf748d"
      width="200px"
    />
    <div>
      <p class="os-raise-mb-0">Social intelligence is the ability to connect with other people. Think about your current sense of social intelligence. Are the following statements are true for you?</p>
      <ul>
        <li>
          I have a lot of relationships that are mutually beneficial, enjoyable, and supportive.
        </li>
        <li>
          Most of the time, I can tell how other people feel and have a good idea about how to respond appropriately.
        </li>
      </ul>
      <p>Don’t worry if none of these statements are true for you. Developing this trait takes time. Your first step starts today!</p>
     </div>
  </div>
</div>
```

---

## Family Support Materials Links

Add a styled container and sentence for family support materials links.

**Examples**

<div style="text-align: center;">
    <img src="./static/familysupportmaterialslinks.png" width="750">
</div>

**Availability**

Family support materials links should only be used in `<div>` elements. There should only ever be a single `<p>`, with an `<a>` to hyperlink the relevant text inside of the `<div>`.

**Usage**

```html
<div class="os-raise-familysupport">
    <p>Access the PDF version of this page to share with parents or guardians: <a href="">Unit 1 Family Support Materials.</a></p>
</div>
```

---

# Flex

## Initializing Flexbox (os-raise-d-flex-nowrap / os-raise-d-flex)

Add to any tag to make content positioning side-by-side.

**Example**

No wrapping

<div style="text-align: center;">
    <img src="./static/osraisedflexnowrap.png" width="600">
</div>

Wrapping

<div style="text-align: center;">
    <img src="./static/osraisedflex.png" width="600">
</div>

**Availability**

Any element

**Usage**

Use os-raise-d-flex-nowrap when you do not want your content to wrap to the next line
once there is not enough space in the parent container. If you do want wrapping to the next line
when there is not enough space in the parent container, then use os-raise-d-flex.


This is an example for os-raise-d-flex-nowrap
```html
<div class="os-raise-d-flexnowrap">
  <p>Paragraph 1</p>
  <h1>Heading 1</h1>
  <p>Paragraph 2</p>
  <h2>Heading 2</h2>
  <p>Paragraph 3</p>
  <h3>Heading 3</h3>
  <p>Paragraph 4</p>
  <h4>Heading 4</h4>
  <p>Paragraph 5</p>
</div>
```

This is an example for os-raise-d-flex
```html
<div class="os-raise-d-flex">
  <p>Paragraph 1</p>
  <h1>Heading 1</h1>
  <p>Paragraph 2</p>
  <h1>Heading 2</h1>
  <p>Paragraph 3</p>
  <h1>Heading 3</h1>
  <p>Paragraph 4</p>
  <h1>Heading 4</h1>
</div>
```

## Center Side-by-Side Content Vertically

Add to any tag that already has one of os-raise-d-flex-nowrap or os-raise-d-flex as a class in order to vertically center side-by-side content.

**Example**

<div style="text-align: center;">
    <img src="./static/alignitemscenter.png" width="600">
</div>

**Availability**

Any element that already contains one of the following classes: os-raise-d-flex-nowrap or os-raise-d-flex.

**Usage**

Vertically center all direct children.

```html
<div class="os-raise-d-flex os-raise-align-items-center">
  <p>Paragraph 1</p>
  <h1>Heading 1</h1>
  <p>Paragraph 2</p>
  <h2>Heading 2</h2>
  <img src="https://s3.amazonaws.com/im-ims-export/WTtRTaNwjScSGve5Eb3qfx5E" alt="A man dropping a ball.&nbsp;" width="100">
</div>
```

## Center Side-by-Side Content Horizontally

Add to any tag that already has one of os-raise-d-flex-nowrap or os-raise-d-flex as a class in order to horizontally center side-by-side content.

**Example**

<div style="text-align: center;">
    <img src="./static/justifycontentcenter.png" width="600">
</div>

**Availability**

Any element that already contains one of the following classes: os-raise-d-flex-nowrap or os-raise-d-flex.

**Usage**

Horizontally center all direct children.

```html
<div class="os-raise-d-flex os-raise-justify-content-center">
  <p>Paragraph 1</p>
  <h1>Heading 1</h1>
  <p>Paragraph 2</p>
  <h2>Heading 2</h2>
</div>
```

## Add Space Between Side-by-Side

Add to any tag that already has one of os-raise-d-flex-nowrap or os-raise-d-flex as a class in order to add space between side-by-side content.

**Example**

<div style="text-align: center;">
    <img src="./static/justifycontentbetween.png" width="600">
</div>

**Availability**

Any element that already contains one of the following classes: os-raise-d-flex-nowrap or os-raise-d-flex.

**Usage**

Adds even spacing between content starting after the first element and ending before the last.

```html
<div class="os-raise-d-flex os-raise-justify-content-between">
  <p>Paragraph 1</p>
  <h1>Heading 1</h1>
  <p>Paragraph 2</p>
  <h2>Heading 2</h2>
</div>
```

## Add Space Equally Around Side-by-Side Content

Add to any tag that already has one of os-raise-d-flex-nowrap or os-raise-d-flex as a class in order to add space between side-by-side content.

**Example**

<div style="text-align: center;">
    <img src="./static/justifycontentevenly.png" width="600">
</div>

**Availability**

Any element that already contains one of the following classes: os-raise-d-flex-nowrap or os-raise-d-flex.

**Usage**

Adds even spacing between content including before the first and after the last element.

```html
<div class="os-raise-d-flex os-raise-justify-content-evenly">
  <p>Paragraph 1</p>
  <h1>Heading 1</h1>
  <p>Paragraph 2</p>
  <h2>Heading 2</h2>
</div>
```

## Add 16px of Space Between Content

Add to any tag that already has one of os-raise-d-flex-nowrap or os-raise-d-flex as a class in order to add 16px of space between child elements and their siblings.

**Example**

<div style="text-align: center;">
    <img src="./static/osraisegap1.png" width="600">
</div>

**Availability**

Any element that already contains one of the following classes: os-raise-d-flex-nowrap or os-raise-d-flex.

**Usage**

Adds 1 rem (16px) of space between content.

```html
<div class="os-raise-d-flex os-raise-gap-1">
  <p>Paragraph 1</p>
  <img src="https://s3.amazonaws.com/im-ims-export/WTtRTaNwjScSGve5Eb3qfx5E" alt="A man dropping a ball.&nbsp;" width="100">
  <p>Paragraph 2</p>
</div>
```

## Add 32px of Space Between Content

Add to any tag that already has one of os-raise-d-flex-nowrap or os-raise-d-flex as a class in order to add 32px of space between child elements and their siblings.

**Example**

<div style="text-align: center;">
    <img src="./static/osraisegap2.png" width="600">
</div>

**Availability**

Any element that already contains one of the following classes: os-raise-d-flex-nowrap or os-raise-d-flex.

**Usage**

Adds 1 rem (32px) of space between content.

```html
<div class="os-raise-d-flex os-raise-gap-2">
  <p>Paragraph 1</p>
  <img src="https://s3.amazonaws.com/im-ims-export/WTtRTaNwjScSGve5Eb3qfx5E" alt="A man dropping a ball.&nbsp;" width="100">
  <p>Paragraph 2</p>
</div>
```

---

## Centered text (os-raise-text-center)

This utility class can be applied to center content using the [`text-align` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align).

**Example**

<div style="text-align: center;">
    <img src="./static/center.png" width="600">
</div>

**Availability**

Any block element or table-cell box (e.g. any element where `text-align` CSS property can apply).

**Usage**

```html
<p><img src="https://openstax.org/dist/images/logo.svg" /></p>
<p class="os-raise-text-center">
  <img src="https://openstax.org/dist/images/logo.svg" />
</p>

<table class="os-raise-standardtable">
  <tr>
    <th class="os-raise-text-center">Centered heading</th>
    <th>Default heading</th>
  </tr>
  <tr>
    <td>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </td>
    <td>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </td>
  </tr>
</table>
```

---

## Bold Text

This class should be used to apply a bold styling to text.
If text is meant to convey "strong importance" (things of great seriousness or urgency - such as a warning) then wrap the applicable text in a ```<strong>``` tag instead of applying this class.

**Example**

<div style="text-align: center;">
    <img src="./static/boldtext.png" width="300">
</div>

**Availability**

Any element that contains text.

**Usage**

```html
<p class="os-raise-text-bold">This text is bold.</p>
```

---

## Italicize Text

This class should be used to apply an italicized styling to text.
If text is meant to convey "emphasis" (words that have a stressed emphasis compared to surrounding text) then wrap the applicable text in a ```<em>``` tag instead of applying this class.

**Example**

<div style="text-align: center;">
    <img src="./static/italicizedtext.png" width="300">
</div>

**Availability**

Any element that contains text.

**Usage**

```html
<p class="os-raise-text-italicize">This text is italicized.</p>
```

---

## Responsive Media

Improve image and `<video>` responsiveness by adding a maximum width and allowing the browser to calculate and select a height for the image / `<video>`. As a general rule, the max width will be 100% of the containing block's width. The `<width>` and `<height>` attributes should not be applied to `<video>`.

**Example**

<div style="text-align: center;">
    <img src="./static/responsiveimage.png" width="500">
</div>

**Availability**

Add as a class attribute to `<img>` or `<video>`.

**Usage**

```html
<img src="https://openstax.org/dist/images/logo.svg" class="os-raise-media-responsive">
```

```html
<video controls="true" crossorigin="anonymous" class="os-raise-media-responsive">
  <source src="https://k12.openstax.org/contents/raise/resources/3dd4ea7de318dc0911be9212995411f6c406a778">
  <track default="true" kind="captions" label="On" src="https://k12.openstax.org/contents/raise/resources/086bdd4741914a59f9365c92f251f58e225f0211" srclang="en_us">https://k12.openstax.org/contents/raise/resources/3dd4ea7de318dc0911be9212995411f6c406a778
</video>
```

---

## Responsive iframe

Improve `<iframe>` responsiveness by adding a parent container for `<iframe>` and a class for both the parent container and the `<iframe>`. The `<width>` and `<height>` attributes should not be applied to the `<iframe>` or its parent container.

**Example**

<div style="text-align: center;">
    <img src="./static/responsiveiframe.png" width="750">
</div>

**Availability**

Add as a class attribute to `<iframe>` and its parent container.

**Usage**

```html
<div class="os-raise-iframe-container">
  <iframe class="os-raise-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" src="https://www.youtube.com/embed/w6R8rywmgek" title="Linear equation word problems"></iframe>
</div>
```