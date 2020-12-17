import React, { Component }from 'react';
import { createAppContainer } from '@react-navigation/native';
import { createRootNavigator } from './src/components/Rotas';
import { isSignedIn } from './src/components/Auth';

export default class App extends Component{

    constructor(props) {
      super(props);
      this.state = {
        signedIn: false,
        checkedSignIn: false
      };
    }

    componentDidMount(){
      isSignedIn()
        .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
        .catch(err => alert("An error occurred"));
    }
   
    render () {

      const { checkedSignIn, signedIn } = this.state;

      // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
      if (!checkedSignIn) {
        return null;
      }
      
      const Navgation = createRootNavigator(signedIn);
      const AppContainer = createAppContainer(Navgation);

      return <AppContainer />
    }
  }

