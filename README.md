# Eendraadschema tekenen -- Drawing a one-wire diagram

## Purpose

Design and draw a one-wire diagram as enforced by the Belgian AREI legislation.
Source code written in Typescript, transpiled to Javascript and run in a browser.

Present files are a standalone copy of the online version found at https://eendraadschema.goethals-jacobs.be.
Note that some limited functionalities will not be available in the standalone version.
We refer to the online version if you whish to use this tool in a production setting.

## History

Software developed by Ivan Goethals between as of March 2019.
Placed on Github as-is on June 1st 2020 and further developed on Github.
So far, Ivan is the only known contributor to the project.

## How to build the website
Checkout this repository into a dedicated folder.

Install dependencies using your favorite package manager for Node (such as `npm` or `yarn`):
```shell
npm install
```
Running the development server:
```shell
npm run start
```
Build production website:
```shell
npm run build
```
The files will be located in the `/dist` folder.

## Further development

The eendraadschema software is, and has been used by various hobbyists on the Belgian
market. As such it is important that the software remains backwards compatible with
all earlier generated EDS-files.

Given that exports- and imports- of the schematics (EDS-file) are basically
json-dumps of internal data-structures, until further notice, this entails the following:
- No fundamental changes can be allowed to the data-model underlying the hierarchical trees that can be
  drawn with the software, as embedded in the Hierarchical_List -class.
- No fundamental changes can be allowed to the Electro_Item -class constructor. Especially the order of the
  keys must be maintained. If new future features require an extension of the number of available keys,
  extra keys should be added at the end.
