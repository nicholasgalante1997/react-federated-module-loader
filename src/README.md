# React Federated Module Loader

## Getting Started

### Installation

You can install `react-federated-module-loader` with either yarn or npm.

```bash

npm install --save react-federated-module-loader # npm

yarn add react-federated-module-loader # yarn

```

### Basic Usage

```jsx
import React from 'react'
import { useFederatedModule } from 'react-federated-module-loader'

const App = (props) => {
    /** url: string; the location of your hosted remoteEntry.js file */
    const url = 'http://wherever-you-host-federated-modules/remoteEntry.js';

    /** 
     * scope: string; this corresponds to the 'name' of the remote webpack bundle
     * i.e. the value of the 'name' key in your ModuleFederationPlugin configuration
     */
    const scope = 'myRemoteBundleName';

    /** module: string; the name of the remote module you are consuming */
    const moduleName = './MyModule';

    const {
      scriptReady,
      scriptFailed,
      error,
      isLoading, 
      data 
    } = useFederatedModule(url, scope, moduleName);

    if (scriptFailed || error) {
        // handle error state if remote isnt available
    }

    if (isLoading) {
        return <span>Loading...</span>
    }

    return (
        <div>
            {/** the presumption is the remote module has such properties */}
            {data.pageContent.home.title}
        </div>
    )
}
```

## Inspiration

*Module Federation* [!docs](https://webpack.js.org/concepts/module-federation/) 

Module Federation is one of the most promising emerging technologies in the frontend landscape and if you are unfamiliar with Module Federation, I highly recommend browsing the documentation mentioned above. This package is intended to be used in conjunction with federated microfrontends, and is supposed to provide ease of use for developers who want to begin 