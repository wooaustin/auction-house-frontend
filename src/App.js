import React from "react";
import NavBar from "./components/NavBar";
import { Prompt, Redirect } from 'react-router-dom';
import ButtonAppBar from './components/ButtonAppBar';
import { Router, Switch } from "react-router-dom";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import AuctionsPage from './pages/AuctionsPage';
import AboutPage from './pages/AboutPage'
import CreateAuctionPage from './pages/CreateAuctionPage';
import LoadingSpinner from './components/LoadingSpinner';
import MyAuctionsPage from './pages/MyAuctionsPage';
import { inject, observer } from 'mobx-react';
import MyBidsPage from './pages/MyBidsPage';
import HomePage from './pages/HomePage';
const App = (props) => {
  const { overlayStore } = props;

  return (
    <div className="App">
      <LoadingSpinner display={overlayStore.displaySpinner} />
      <Router history={history}>
        <header>
          <ButtonAppBar />
        </header>
        <Switch>
          <PrivateRoute path="/" exact component={HomePage} />
          <PrivateRoute path="/auctions" component={AuctionsPage} />
          <PrivateRoute path="/create" component={CreateAuctionPage} />
          <PrivateRoute path="/myauctions" component={MyAuctionsPage} />
          <PrivateRoute path="/about" component={AboutPage} />
          <PrivateRoute path="/mybids" component={MyBidsPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default inject('overlayStore')(observer(App));
