# 1. React QR Reader

**Attention!!!!**

This repository and library is fork from here https://github.com/JodusNodus/react-qr-reader

## Table of contents <!-- omit in toc -->

- [1. Use Case](#1-use-case)
- [2. Compatibility](#2-compatibility)
- [3. Installation](#3-installation)
  - [3.1. NPM](#31-npm)
  - [3.2. YARN](#32-yarn)
- [4. Example Usage](#4-example-usage)
- [5. Component API](#5-component-api)
- [6. Maintainers](#6-maintainers)
- [7. Browser Support](#7-browser-support)

## 1. Use Case

You need a component for Scanning QR codes from a web browser based app.

## 2. Compatibility

This component has been tested in the following browsers:

- Chrome Mac OS & Android
- Firefox Mac OS & Android
- Safari Mac OS & IOS

Since this library does internal use of hooks you need `React >= 18.2.0`.

## 3. Installation

You can install this library via NPM or YARN.

### 3.1. NPM

```bash
npm i react-qr-reader
```

### 3.2. YARN

```bash
yarn add react-qr-reader
```

## 4. Example Usage

After reading and performing the previous steps, you should be able to import the library and use it like in this example:

```jsx
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const Test = () => {
  const [error, setError] = useState('');
  const [data, setData] = useState('');

  return (
    <div style={styles.container}>
      <QrReader
        {...args}
        onResult={(result, error) => {
          if (result) {
            setData(result.getText());
          }

          if (error) {
            setError(error.message);
          }
        }}
      />
      <p>The value is: {JSON.stringify(data, null, 2)}</p>
      <p>The error is: {error}</p>
    </div>
  );
};
```

## 5. Component API

The `QrReader` component has the following props:

| Properties          | Types                                                                                           | Default Value            | Description                                              |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------- |
| constraints         | [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) | `{ facingMode: 'user' }` | Specify which camera should be used (if available).      |
| onResult            | `function`                                                                                      | none                     | Scan event handler                                       |
| videoId             | `string`                                                                                        | `video`                  | The ID for the video element                             |
| scanDelay           | `number`                                                                                        | `500`                    | The scan period for the QR hook                          |
| ViewFinder          | component                                                                                       | none                     | ViewFinder component to rendering over the video element |
| className           | string                                                                                          | none                     | ClassName for the container element.                     |
| containerStyle      | object                                                                                          | none                     | Style object for the container element.                  |
| videoContainerStyle | object                                                                                          | none                     | Style object for the video container element.            |
| videoStyle          | object                                                                                          | none                     | Style object for the video element.                      |

## 6. Maintainers

- Current Maintainers [@memenashi](https://github.com/memenashi)


- Original Author [@JodusNodus](https://github.com/JodusNodus)

## 7. Browser Support

If you need to support older browsers, checkout [this guide](https://github.com/zxing-js/library#browser-support) in how to make it compatible with legacy ones
