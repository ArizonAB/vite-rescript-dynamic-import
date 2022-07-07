// --- Dynamically loading a module ---
// We need the type of the module we're loading, so we can ensure the import
// gets the right type.
module type Utils = module type of Utils

// Key here is `@rescriptModule/<nameOfModule>`. Our vite plugin will transform
// that string to the correct path of the generated JS file of <nameOfModule>.
@val
external import_Utils: (@as(json`"@rescriptModule/Utils"`) _, unit) => Js.Promise.t<module(Utils)> =
  "import"

// This just demonstrates loading the Utils module dynamically and using a
// function from it.
let demonstrateUtilsImport = () => {
  import_Utils()->Js.Promise.then_(m => {
    let module(U: Utils) = m
    Js.log(U.add(1, 2))
    Js.Promise.resolve()
  }, _)->ignore
}

@react.component
let make = () => {
  <div>
    {React.string(
      "Welcome to this fine, unstyled app. Use the buttons below to demonstrate dynamic imports.",
    )}
    <div>
      <button onClick={_ => demonstrateUtilsImport()}>
        {React.string("Load and use Utils.res")}
      </button>
    </div>
  </div>
}
