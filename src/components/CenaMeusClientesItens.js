/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
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
import { View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class CenaMeusClientesItens extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.toggleModalOpcao(this.props.publicacao);
        }}
      >
        <View style={styles.item}>
          <View style={styles.detalhesItem}>
            <View style={styles.detalhesItem2Coluna1}>
              <Text style={styles.txtCliente}>
                {this.props.publicacao.nome}
              </Text>
            </View>
            <View style={styles.detalhesItem2Coluna2}>
              <Text
                style={[styles.txtCliente,{ color: "#716ACA", fontWeight: "bold" }]}
              >
                 {this.props.publicacao.cnpj_cpf}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex:1,
    width: wp("97%"),
    flexDirection:"column",
    borderWidth: 0.5,
    borderColor: "#999",
    margin: "1.5%"
  },
  detalhesItem: {
    backgroundColor: "#F6F6F6",
    width: wp("97%"),
    height: hp(10),
    flexDirection: "column",
    paddingHorizontal: "1.5%"
  },
  detalhesItem2Coluna1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  detalhesItem2Coluna2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  txtCliente: {
    fontSize: wp("4%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    textAlign: "left",
    marginTop: "1%"
  },
  img: {
    width: wp("6%"),
    height: hp("5%"),
    resizeMode: "contain"
  }
});
