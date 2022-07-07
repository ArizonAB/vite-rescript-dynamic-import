# Dynamic imports in ReScript using Vite

This is a tiny example of a Vite plugin we've used at [Arizon](https://github.com/ArizonAB) for quite a while in production to work around ReScript not having out of the box support for dynamic imports yet. The Vite plugin lets you do this: `import("@rescriptModule/NameOfReScriptModule")`. It swaps out that string for the full location (`import("/Users/whoever/whateverProject/src/maybe/nested/folders/NameOfReScriptModule.mjs")`) of the generated JS for `NameOfReScriptModule`, so that Vite can bundle and dynamically import `NameOfReScriptModule` without us needing to specify the exact file system location of that module in the code itself.

## Running

Run the client in dev mode with:

```bash
# Start separately
yarn res:watch

# And in another terminal
yarn serve

# Now open your browser at http://localhost:8888
```

Build a prod bundle with:

```bash
yarn build
```

After building there's also a `stats.html` emitted in the root directory that you can load in your browser to inspect how the bundle looks, and ensure that the dynamic import is indeed not inlined in the main bundle.

## Using in your own project

Copy and wire up `ReScriptDynamicImportVitePlugin.mjs` in your own Vite project. Adapt the plugin as you need to make it work for you. It currently expects your project to be `"type": "module"` etc, but there's no hard restriction on that, you could convert the plugin to commonjs if that's what your project is using.

## Caveats

This is _not_ an official solution, and it's not guaranteed to work in your project. That's also why it's not released as an actual package. Take it and adapt it to your needs.

## TODO

I'll add a `React.lazy` example too later.

## Longer term solution

I'm hoping that the longer term solution to this problem is:

1. ReScript adds a util that lets us get the path of a generated JS file directly inside of the compiler, so we don't have to "hack" vite. Issue [tracking that here](https://github.com/rescript-lang/rescript-compiler/issues/5018). Contributions would be very welcome, so if you're interested in taking a stab at this, please reach out.
2. ReScript vendors some sort of PPX (or other solution) that helps with the module type generation + wiring to make this all type check. It needs to be as smooth to use as TypeScript, and there's opportunity to make it even more smooth than TS given that we don't need to keep track of paths in ReScript.

## rescript-relay

If you're using [`rescript-relay`](https://github.com/zth/rescript-relay), there's an embedded PPX you can leverage for using `React.lazy` (if you also add this Vite plugin to your project). It looks like this:

```reasonml
module WhateverComponent = %relay.deferredComponent(WhateverComponent.make)

// WhateverComponent is now a React.lazy component dynamically importing WhateverComponent, ready to be used as a regular React component.
```

`%relay.deferredComponent` is part of a larger effort in `rescript-relay` to introduce a dedicated router optimized for Relay. Stay tuned for more info on that if you're interested.
