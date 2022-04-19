<!-- markdownlint-disable -->

<p align="center">
<img width="450" src="./static/logo.svg" alt="Alberto Fardin">
</p>

<div align="center">
  This is my personal web site and portfolio online.

  Visit [this link](https://github.com/AlbertoFardin/portfolio_components) to see the components that I done.

  This is a customizable library to build faster and more accessible applications.
  
  Follow design system of [Material Design](https://material.io/design/introduction/).
  
  Build with [ReactJs](https://reactjs.org/) and [Npm](https://www.npmjs.com/)
</div>

## Development

Install dependencies using the command `npm install`

Start local application with command `npm run dev` and open `https://local.portfolio.com` from the browser.

## Component's Unit Test

Write tests and run them all with `npm run test`.

Tests are written in a folder `__tests__` in the same root where the function/component to test are.
You can run a single test using the `debugger tool` of VSCode.

To have code robust, easy to read and easy to maintain, each complex functionality, or component, must be divided into micro parts and for each one create an descrived unit test with [Jest](https://jestjs.io/).

## Component's documentation

The documentation that must be produced is a description of the component and functionality more linear as possible, in human language and write for technicians (developers) so that it is possible to do maintenance and refactoring for improvements.

It should contain all the functional requirements, described in the US that the code translates
leaving the technical description in the background.

Each component should have at the top of its definition, the description and the requirements mentioned above.
While in the code there should be comments to understand what the logics define.

## License

This project is licensed under the terms of the [MIT license](./static/LICENSE).
