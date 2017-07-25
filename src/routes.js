import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

/* Common Components */

import Sidebar from './common/sidebar';
import Header from './common/header';
import Footer from './common/footer';

/* Pages */

import Homepage from './routes/Homepage';

import Dashboard from './routes/Dashboard';
import ExecDashboard from './routes/ExecDashboard';
import Contact from './routes/Contact';
import Profile from './routes/Profile';
import DataBrowser from './routes/DataBrowser';
import Gallery from './routes/Gallery';
import Social from './routes/Social';
import Login from './routes/Login';
import Signup from './routes/Signup';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        tbl_ready: '',
        pk:'',
        sk:'',
        ck:'',
    };    
  }

  handleLanguage(langValue,pk,sk,ck) {
    this.setState({tbl_ready: langValue,pk:pk,ck:ck,sk:sk});
  }
  render() {
        var childrenWithMoreProps = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          third_changed: this.state.tbl_ready,
          pk:this.state.pk,
          sk:this.state.sk,
          ck:this.state.ck
        });
    });
    return (
      <MainContainer {...this.props}>
        <Sidebar onSelectLanguage={this.handleLanguage.bind(this)}/>
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {childrenWithMoreProps}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }
}

/**
 * Includes Sidebar, Header and Footer.
 */
const routes = (
  <Route component={App}>
    <Route path='dashboard' component={Dashboard} />
    <Route path='execdashboard' component={ExecDashboard} />
    <Route path='databrowser' component={DataBrowser} />
    <Route path='contact' component={Contact} />
    <Route path='gallery' component={Gallery} />
    <Route path='profile' component={Profile} />
    <Route path='social' component={Social} />
  </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
  <Route>
    <Route path='login' component={Login} />
    <Route path='signup' component={Signup} />
  </Route>
);

const combinedRoutes = (
  <Route>
    <Route>
      {routes}
    </Route>
    <Route>
      {basicRoutes}
    </Route>
  </Route>
);

export default (
  <Route>
    <Route path='/' component={Homepage} />

    <Route path='/ltr'>
      {combinedRoutes}
    </Route>
    <Route path='/rtl'>
      {combinedRoutes}
    </Route>
  </Route>
);
