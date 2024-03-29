# RAISE Content Application

This repository contains code and styling used in conjunction with content in Moodle for the RAISE project.

## Development setup

Prerequisites:

* Install [Node Version Manager](https://github.com/nvm-sh/nvm)
* Create a local Moodle environment using [raise-moodle-spikes](https://github.com/openstax/raise-moodle-spikes)

Run the following in a terminal to continuously build code as you make changes:

```bash
$ nvm use
$ npm install
$ npm run watch
```

In a separate terminal launch the development server to serve assets:

```bash
$ npm run dev
```

Configure your Moodle instance to include the Javascript and CSS bundles:

1. Navigate to `Site Administration` -> `Appearance` -> `Additional HTML`
2. Populate the following into the `Within HEAD` box and save:

```
<link rel="stylesheet" href="http://localhost:3000/dist/assets/index.css">
<script type="module" crossorigin src="http://localhost:3000/dist/assets/index.js"></script>
```

### Helper scripts

There are a few script commands defined to help with running linters and tests:

```bash
$ npm run lint
$ npm test
```

### VS Code setup

If you're using VS Code as your editor, the following extensions can help with development:

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

For `Stylelint`, you will need to add the following to your `.vscode/settings.json` to see linting errors for `.scss` files:

```json
{
  "stylelint.validate": ["css", "scss"]
}
```

## Schemas for Interactive Blocks and Content Templates

Please refer to [schemas](docs/schemas.md) for details on using supported interactive capabilities.


## Update the Events API Client Code in EventsAPI

In order to update the client code generated by openapi to serve the EventsAPI you can use the command below. This process creates a docker container with java which runs the openapi-generator-cli commands. 

If you want to modify the language or location of the client code, modify the arguments following -g or -o respectively. 

```bash
$ cd k12-apps-raise
$ docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
  -i https://events.raiselearning.org/openapi.json \
  -g typescript-fetch \
  -o local/src/eventsapi
```
