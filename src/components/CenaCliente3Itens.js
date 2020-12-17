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
import { View, Text, StyleSheet, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default class CenaCliente3Itens extends Component {

  render() {
    return (
      <View style={styles.item}>
        {/* IDENTIFICACAO */}
        <View style={styles.detalhesItem1}>
          <View style={styles.detalhesItem1Coluna1}>
            <Text style={[styles.txtPedido, { marginLeft:"5%" }]}>{this.props.itemFazenda.fazenda}</Text>
          </View>
          <View style={styles.detalhesItem1Coluna2}>
            <Text style={[styles.txtPedido, {marginRight:"5%"}]}>{this.props.itemFazenda.inscricao}</Text>
          </View>
        </View>
        <View style={styles.detalhesItem1}>
          <View style={styles.detalhesItem1Coluna3}>
            <Text style={[styles.txtPedido, { marginLeft:"3%"}]}>{this.props.itemFazenda.email}</Text>
          </View>
          <View style={styles.detalhesItem1Coluna4}>
            <Text style={[styles.txtPedido, {marginRight:"5%"}]}>{this.props.itemFazenda.telefone}</Text>
          </View>
        </View>
        {/* LOCALIZACAO */}
        <View style={styles.detalhesItem2}>
          <View style={styles.detalhesItem2Coluna1}>
            <Text style={[styles.txtValor, { color: "#716ACA", marginLeft:"5%" }]}>{this.props.itemFazenda.endereco}</Text>
          </View>
          <View style={styles.detalhesItem2Coluna2}>
            <Text style={[styles.txtValor, { color: "#716ACA", marginRight:"5%" }]}>{this.props.itemFazenda.cep}</Text>
          </View>
        </View>
        <View style={styles.detalhesItem2}>
          <View style={styles.detalhesItem2Coluna3}>
            <Text style={[styles.txtValor, { color: "#716ACA", marginLeft:"5%" }]}>{this.props.itemFazenda.complemento}</Text>
          </View>
          <View style={styles.detalhesItem2Coluna4}>
            <Text style={[styles.txtValor, { color: "#716ACA", marginRight:"5%" }]}>{this.props.itemFazenda.cidade}/{this.props.itemFazenda.estado}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    width: wp("97%"),
    flexDirection:"column",
    borderWidth: 0.5,
    borderColor: "#999",
    margin: "1.5%"
  },
  detalhesItem1: {
    width: wp("97%"),
    height: hp(7),
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center"
  },
  detalhesItem1Coluna1: {
    flex: 0.7,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  detalhesItem1Coluna2: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  detalhesItem1Coluna3: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  detalhesItem1Coluna4: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

  /* PARTE DE BAIXO */
  detalhesItem2: {
    width: wp("97%"),
    height: hp(7),
    backgroundColor: "#F6F6F6",
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center"
  },
  detalhesItem2Coluna1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  detalhesItem2Coluna2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  detalhesItem2Coluna3: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  detalhesItem2Coluna4: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  /*elementos*/
  txtPedido: {
    fontSize: wp("4%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold" 
  },
  txtValor: {
    fontSize: wp("4%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "800"
  },
  img: {
    width: wp("5%"),
    height: hp("3%"),
    resizeMode: "contain"
  }
});
