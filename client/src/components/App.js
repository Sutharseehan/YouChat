import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home/Home"
import Login from "./Login/Login"
import Register from "./Register/Register"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
      </Switch>
    </Router>
  );
}

export default App;
