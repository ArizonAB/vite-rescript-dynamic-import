@val external getRootElement: (@as(json`"root"`) _, unit) => Dom.element = "document.getElementById"

<App />->ReactDOM.render(getRootElement())
