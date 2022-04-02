import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Details from './Details';
import SearchParams from './SearchParams';
import ThemeContext from './ThemeContext';

const App = () => {
  const theme = useState('darkblue');
  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <Router>
          <header>
            <Link to="/">
              <h1>Adopt me!</h1>
            </Link>
          </header>
          <Switch>
            <Route path="/details/:id">
              <Details />
            </Route>
            <Route path="/">
              <SearchParams />
            </Route>
          </Switch>
        </Router>
        {/* <Pet name="Luna" animal="Dog" breed="Rottweiler" />
      <Pet name="Jack" animal="Parrot" breed="Ring Necked" />
      <Pet name="Raja" animal="Lion" breed="Great Bengal Tiger" /> */}
      </div>
    </ThemeContext.Provider>
  );
};

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
// ReactDOM.render(<App />, document.getElementById('root'));
