import React from 'react'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

//Pages 
import Downloads from './Pages/Downloads'
import Search from './Pages/Search'

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/search" />
          </Route>
          <Route exact path="/download" render={(props) => <Downloads {...props} />} />
          <Route exact path="/search" render={(props) => <Search {...props} />} />
        </Switch>
      </Router>
    </>
  )
}

export default App