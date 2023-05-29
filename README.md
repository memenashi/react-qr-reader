# React QR Reader

**Attention!!!!**

This repository and library is fork from here https://github.com/JodusNodus/react-qr-reader

## Table of contents

- [Table of contents](#table-of-contents)
- [Use Case](#use-case)
- [Compatibility](#compatibility)
- [Installation](#installation)
  - [NPM](#npm)
  - [YARN](#yarn)
- [Example Usage](#example-usage)
- [Component API](#component-api)
- [Maintainers](#maintainers)
- [Browser Support](#browser-support)
- [Issues](#issues)
- [Contributing](#contributing)
- [License](#license)

## Use Case

You need a component for Scanning QR codes from a web browser based app.

## Compatibility

This component has been tested in the following browsers:

- Chrome Mac OS & Android
- Firefox Mac OS & Android
- Safari Mac OS & IOS

Since this library does internal use of hooks you need `React >= 18.2.0`.

## Installation

You can install this library via NPM or YARN.

### NPM

```bash
npm i react-qr-reader
```

### YARN

```bash
yarn add react-qr-reader
```

## Example Usage

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

## Component API

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

## Maintainers

- Created by [@JodusNodus](https://github.com/JodusNodus) .
- Revived thanks to [@JonatanSalas](https://github.com/JonatanSalas) and his company [@BlackBoxVision](https://github.com/BlackBoxVision) .

## Browser Support

If you need to support older browsers, checkout [this guide](https://github.com/zxing-js/library#browser-support) in how to make it compatible with legacy ones

## Issues

Please, open an [issue](https://github.com/react-qr-reader/react-qr-reader/issues) following one of the issues templates. We will do our best to fix them.

## Contributing

If you want to contribute to this project see [contributing](https://github.com/react-qr-reader/react-qr-reader/blob/master/CONTRIBUTING.md) for more information.

## License

Distributed under the **MIT license**. See [LICENSE](https://github.com/react-qr-reader/react-qr-reader/blob/master/LICENSE) for more information.
