/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  BackHandler,
  ToastAndroid,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
const btnSeta = require("../../imgs/back.png");
const btnMenu = require("../../imgs/btn_menu.png");
const logoTopo = require("../../imgs/logo_topo.png");

export default class BarraNavegacao extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      try {
        this.props.navigation.goBack();
        return true;
      } catch (err) {
        ToastAndroid.show("Cannot pop. Exiting the app...", ToastAndroid.SHORT);
        return true;
      }
    });
    loc(this);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
    });
    rol();
  }

  render() {
    if (this.props.voltar) {
      return (
        <View style={styles.barraTopo}>
          <View style={styles.viewBtnSeta}>
            <TouchableHighlight
              underlayColor={"#409551"}
              activeOpacity={0.3}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image style={styles.btnSeta} source={btnSeta} />
            </TouchableHighlight>
          </View>
          <View style={styles.viewLogoTopo}>
          <TouchableOpacity
               onPress={() =>{ 
                this.props.navigation.popToTop();
                //this.props.navigation.navigate("principal");
              }}
          >
            <Image style={styles.logoTopo} source={logoTopo} />
          </TouchableOpacity>
          </View>
          <View style={styles.viewBtnMenu}>
            <TouchableOpacity
              onPress={() => {
                this.props.toggle();
              }}
            >
              <Image style={styles.btnMenu} source={btnMenu} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.barraTopo}>
        <View style={styles.viewBtnSeta}></View>
        <View style={styles.viewLogoTopo}>
          <Image style={styles.logoTopo} source={logoTopo} />
        </View>

        <TouchableHighlight
          underlayColor={"#409551"}
          activeOpacity={0.3}
          onPress={this.props.abremenu}
        >
          <View style={styles.viewBtnMenu}>
            <Image style={styles.btnMenu} source={btnMenu} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  barraTopo: {
    backgroundColor: "#409551",
    height: hp("8.5%"),
    flexDirection: "row"
  },
  viewBtnSeta: {
    flex: 1,
    alignItems: "flex-start"
  },
  btnSeta: {
    width: wp("10%"),
    height: hp("6%"),
    resizeMode: "stretch",
    marginLeft: "20%",
    marginTop: "14.5%"
  },
  viewBtnMenu: {
    flex: 1,
    alignItems: "flex-end"
  },
  btnMenu: {
    width: wp("10%"),
    height: hp("5.5%"),
    resizeMode: "stretch",
    marginRight: "15%",
    marginTop: "17%"
  },
  viewLogoTopo: {
    flex: 2,
    alignItems: "center"
  },
  logoTopo: {
    width: wp("45%"),
    height: hp("7%"),
    marginTop: "2.5%",
    resizeMode: "contain"
  }
});
