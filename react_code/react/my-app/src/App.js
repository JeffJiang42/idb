import React, { Component } from 'react';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import MyNavbar from './components/MyNavbar.jsx';
import JobPage from './components/JobPage.jsx';
import CoursePage from './components/CoursePage.jsx';
import SubjectPage from './components/SubjectPage.jsx';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <MyNavbar/>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/jobs' component={JobPage} />
          <Route exact path='/courses' component={CoursePage} />
          <Route exact path='/subjects' component={SubjectPage} />

        </div>
      </Router>
    );
  }
}
export default App;
