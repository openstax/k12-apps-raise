# Supporting interactive content for RAISE

One of the goals of the code in this repository is to support content developers in implementing interactive experiences within Moodle's standard Page and Lesson activities which may otherwise be constrained to static HTML. Moreover, the implementations are intended to allow for generating event data that can be provided to researchers. We define the following abstractions accordingly:

* **Interactive Block**: A basic primitive that can be combined with others to implement interactive content. The core value here is that for content developers an Interactive Block is described in HTML markup without any concern for the underlying implementation (e.g. the HTML / Javascript / CSS code that brings it to life).

* **Content Template**: A combination of one or more Interactive Blocks that represents a specific interactive experience.

This document provides schema definitions for supported Interactive Blocks as well as examples of Content Templates.

* Interactive Blocks
  * [Content-only Block](#content-only-block)
  * [Call-to-action (CTA) block](#call-to-action-cta-block)
  * [User input block](#user-input-block)
  * [Content tooltip block](#content-tooltip-block)
* Content Templates
  * [Segmented content](#segmented-content)

## Interactive Blocks

This section provides a description and schema template for each Interactive Block.

:warning: All Interactive Blocks must be implemented at the top level of HTML content (e.g. they should not be nested within other content or `<div>`s). They can have peer elements which are not Interactive Blocks.

### Content-only block

#### Description

The Content-only block is used to wrap HTML content which should be conditionally rendered based upon an event from another block.

#### Schema definition

```html
<div class="os-raise-ib-content" data-wait-for-event="eventname" data-schema-version="1.0">
  <!-- INSERT ANY VALID HTML HERE -->
</div>
```

Notes on schema:

* The `data-wait-for-event` attribute is optional and where specified should correspond to a `data-fire-event` from another Interactive Block on the same page (e.g. as part of a Content Template)

### Call-to-action (CTA) block

#### Description

The Call-to-action (CTA) block encapsulates the following components:

* Content HTML
* Prompt HTML
* A button which can be clicked by the user

When the button is clicked, the component will:

* Fire the named event if defined (see schema definition)
* Remove the Prompt HTML
* Remove the button

#### Schema definition

```html
<div class="os-raise-ib-cta" data-button-text="ButtonText" data-fire-event="eventnameX" data-wait-for-event="eventnameY" data-schema-version="1.0">
  <div class="os-raise-ib-cta-content">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
  <div class="os-raise-ib-cta-prompt">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
</div>
```

Notes on schema:

* The `data-wait-for-event` attribute is optional and where specified should correspond to a `data-fire-event` from another Interactive Block on the same page (e.g. as part of a Content Template)
* The `data-fire-event` attribute is optional
* The `data-button-text` is optional but allows the content developer to customize the text in the CTA button. The default value is `Next`.

### User input block

#### Description

The User input block provides a `<textarea>` for user input and is intended to provide a flexible method to allow students to provide longer form input to question prompts (e.g. beyond the problem set use case). It encapsulates the following components:

* Content HTML
* Prompt HTML
* A [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) HTML element
* A button which can be clicked by the user to submit the form
* Acknowledgement HTML

When the button is clicked, the component will:

* Fire the named event if defined (see schema definition)
* Remove the Prompt HTML
* Remove the text input box
* Remove the button
* Display the acknowledgement HTML

#### Schema definition

```html
<div class="os-raise-ib-input" data-button-text="ButtonText" data-fire-event="eventnameX" data-wait-for-event="eventnameY" data-schema-version="1.0">
  <div class="os-raise-ib-input-content">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
  <div class="os-raise-ib-input-prompt">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
  <div class="os-raise-ib-input-ack">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
</div>
```

Notes on schema:

* The `data-wait-for-event` attribute is optional and where specified should correspond to a `data-fire-event` from another Interactive Block on the same page (e.g. as part of a Content Template)
* The `data-fire-event` attribute is optional
* The `data-button-text` is optional but allows the content developer to customize the text in the CTA button. The default value is `Submit`.

### Content tooltip block

#### Description

A Content tooltip block is an in-line block which allows content developers to associate a `<span>` element with a datastore. The datastore consists of keys and values, and if the text within the `<span>` matches a key (case-insensitive match). Available datastores can be found as JSON files [here](../data) in this repository. A datastore can be referenced in attributes by dropping the extension (e.g. the datastore in `mydata.json` can be referenced as name `mydata`). The content block encapsulates the following components:

* A tooltip displayed on hover / focus

#### Schema definition

```html
<span class="os-raise-ib-tooltip" data-store="storename" data-schema-version="1.0"><!-- INSERT TERM HERE --></span>
```

## Content Templates

### Segmented content

#### Description

The Segmented content template combines CTA blocks and a Content-only block to create a page where users can gradually expose new content. It is intended to reduce cognitive load for what would otherwise be single, long pages.

#### Schema definition

The following template provides an example with two CTA blocks and a terminal Content-only block. The number of CTA blocks included in this template are up to the content developer.

```html
<div class="os-raise-ib-cta" data-button-text="Show more" data-fire-event="section1" data-schema-version="1.0">
  <div class="os-raise-ib-cta-content">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
  <div class="os-raise-ib-cta-prompt">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
</div>
<div class="os-raise-ib-cta" data-button-text="Show more" data-fire-event="section2" data-wait-for-event="section1" data-schema-version="1.0">
  <div class="os-raise-ib-cta-content">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
  <div class="os-raise-ib-cta-prompt">
    <!-- INSERT ANY VALID HTML HERE -->
  </div>
</div>
<div class="os-raise-ib-content" data-wait-for-event="section2" data-schema-version="1.0">
  <!-- INSERT ANY VALID HTML HERE -->
</div>
```
