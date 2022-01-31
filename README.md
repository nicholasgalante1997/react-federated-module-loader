# React Federated Module Loader

## Getting Started

### Installation

You can install `react-federated-module-loader` with either yarn or npm.

```bash

npm install --save react-federated-module-loader # npm

yarn add react-federated-module-loader # yarn

```

### Basic Usage

#### What this is used for

This is used to load remote javascript modules from a host application that does not yet use Webpack 5.

Module Federation provides a unique opportunity to more effectively construct your frontend architecture, or rather microfrontend architecture, and get the most reuse out of your code. The concept of microfrontends has been gaining a lot of traction, and while sharing components from one repository to another is not entirely a novel concept, Module Federation introduces some awesome new capabilities to expand well beyond that. A phenomenal and promising aspect of Module Federation is the ability to share *any valid javascript\* code that can be bundled by webpack*, which dramatically expands the breadth of what you can reuse across repositories and how you can begin to organize your FE app.

\**Most things that webpack can bundle safely, with the help of loaders, can be federated through Module Federation*

##### Who This is For

Anybody who ...

- Wants to make use of remotely hosted code inside a project that currently uses webpack 4

##### Why you would use it

- you want to keep your logic separate from your webpack 4 project as you approach a microfrontend architecture
- you have a few common utilities that you use across many of your projects and you'd like to manage them all in one place and still have them be accessible to all of your projects, without having to set up Module Federation in all your projects
- you want to manage all the user facing content or assets in one place and still have them be accessible across all of your projects, without having to set up Module Federation in all your projects
- you are experimenting with using Module Federation for microfrontends, and you are taking a 'strangler pattern' approach, and you do not yet know if you want to update your current host/app shell project to webpack 5

#### What this is NOT used for

todo

#### Implementation

This package supplies a single react hook, `useFederatedModule` and it's implementation can be found below.

In your host webpack 4.x package

```jsx
import React from 'react'
import { useFederatedModule } from 'react-federated-module-loader'

const App = (props) => {
    /** url: string; the location of your hosted remoteEntry.js file */
    const url = 'http:/localhost:3001/remoteEntry.js';

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

In the remote Module Federation federated package's webpack.config.js

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
module.exports = {
...
  devServer: {
      port: 3001,
      apiHistoryFallback: true,
  }
...
  new ModuleFederationPlugin({
      name: 'myRemoteBundleName',
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './MyModule': 'path/to/that/module'
      },
      shared: {
          ...deps
      }
  })
...
}
```

##### Arguments

1) url: string; the location of your hosted remoteEntry.js file
2) scope: string; this corresponds to the 'name' of the remote webpack bundle
3) module: string; the name of the remote module you are consuming
4) options?: UseFederatedModuleOptions
   1) This is an object that allows you to configure certain properties of the hook.

## Advanced Usage

### Options

### But wait, I'm a typescript developer...

Hell yeah you are. We thought of you. `useFederatedModule` is a generic function that allows you to pass a type to it, which is used to provide a type guard to the resolution of the promise. So you can reliably type the data you're consuming. It looks as follows:

```tsx
import React from 'react'
import { useFederatedModule } from 'react-federated-module-loader'

interface FederatedUtilityModule {
    myUtilityFunction: (x: number, y: number) => number;
}

const App = (props) => {
    ...
    const {
      scriptReady,
      scriptFailed,
      error,
      isLoading, 
      data 
    } = useFederatedModule<FederatedUtilityModule>(url, scope, moduleName);

    if (scriptFailed || error) {
        // handle error state if remote isnt available
    }

    if (isLoading) {
        return <span>Loading...</span>
    }

    const { myUtilityFunction } = data;

    return (
        <div>
           {myUtilityFunction(3, 5)}
        </div>
    )
}
```

#### Patterns

##### Federated Dictionary

This is an expansion of the backend "Service Dictionary" concept offered by Luca Mezzalira in 'Building Microfrontends.

todo

##### Page Hydration Patterns

## Inspiration

*Module Federation* [!docs](https://webpack.js.org/concepts/module-federation/)

Module Federation is one of the most promising emerging technologies in the frontend landscape and if you are unfamiliar with Module Federation, I highly recommend browsing the documentation mentioned above, or going even further and reading some of the literature tagged in the appendix. This package is intended to be used in conjunction with microfrontends/projects that use Module Federation, and is supposed to provide ease of use for developers who want to begin experimenting with remote hosted code from inside an existing project without the hassle of setting up a bulk of the logic that is necessary to use it from a webpack 4 project, or who doesn't want to go through the hassle of migrating that project to webpack 5.

### Credits & Funding

This package leans largely on the work of Jack Herrington and Zach Jackson, who provided the implementations for the `useDynamicScript` hook that the `useFederatedModule` hook relies on for appending the remoteEntry.js script tag to the document and loading the exposed modules. The implementation of appending the loaded module to the window object can also be attributed to work they've made available in [!Practical Module Federation](https://module-federation.github.io/), which I would recommend to anyone who sees the promise of a cohesive microfrontend architecture.

You'll noticed there's no funding for this library, and this library will never ask for funding. I just want Module Federation to be available to all, with minimal effort, and maximum ease of use. If you're feeling particularly spendy, I'd once again suggest purchasing the above book.

### Appendix

#### Learn More about Module Federation & Microfrontends

*Module Federation Docs* [!docs](https://webpack.js.org/concepts/module-federation/)
*Module Federation Youtube Playlist* [!youtube](https://www.youtube.com/playlist?list=PLNqp92_EXZBLr7p7hn6IYa1YPNs4yJ1t1)
*Building Microfrontends*[!link](https://www.oreilly.com/library/view/building-micro-frontends/9781492082989/)
