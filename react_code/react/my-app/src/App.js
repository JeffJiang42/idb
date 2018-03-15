import React, { Component } from 'react';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import MyNavbar from './components/MyNavbar.jsx';
import Jobs from './components/Jobs.jsx';
import Courses from './components/Courses.jsx';
import Subjects from './components/Subjects.jsx';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <MyNavbar/>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/jobs' component={Jobs} />
          <Route exact path='/courses' component={Courses} />
          <Route exact path='/subjects' component={Subjects} />

        </div>
      </Router>
    );
  }
}
export default App;
