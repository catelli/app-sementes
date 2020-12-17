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
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default class CenaMeusPedidosItens extends Component {

  formatNumber(amount, decimalCount = 3, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const corStatus =  "";
    switch(this.props.publicacao.status) {
      case 'aberto':
        this.corStatus = "#dc143c";
        break;
      case 'fechado':
        this.corStatus = "#ffdb28";
        break;
      case 'enviado':
        this.corStatus = "#2afd9e";
        break;
    }

    return (
      <View style={styles.item}>
        <View style={styles.detalhesItem2}> 
          <View style={[{ flex: 0.5 }]}>
            <TouchableOpacity onPress={() => this.props.publicacao.status === 'aberto' ? null : this.props.delete(this.props.publicacao.id)}>
              <Image style={styles.img} source={this.props.publicacao.status === 'aberto'? require("../../imgs/search.png"): require("../../imgs/close.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.detalhesItem2Coluna1}>
            <Text style={[styles.txtValor, { color: "#716ACA" }]}>
              {this.props.publicacao.data}
            </Text>
          </View>
          <View style={styles.detalhesItem2Coluna2}>
            <Text style={[styles.txtValor, { color: "#716ACA" }]}>
              R$ {this.props.publicacao.valor_total ? this.formatNumber(this.props.publicacao.valor_total.toString()): ""}
            </Text>
          </View>
        </View>
        <View style={styles.detalhesItem1}>
          <View style={styles.detalhesItem1Coluna1}>
            <Text style={[styles.txtPedido, {marginLeft: "26%"}]}>{this.props.publicacao.id}</Text>
          </View>
          <View style={styles.detalhesItem1Coluna2}>
            <Text style={styles.txtPedido}>{this.props.publicacao.nome_cliente}</Text>
          </View>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.txtPedido, {color: this.corStatus}]}>{this.props.publicacao.status.toString().toUpperCase()}</Text>
          </View>
        </View>
      </View>
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
    margin: "1.5%",
    padding:"1%",
    overflow: "hidden"
  },
  detalhesItem1: {
    width: wp("97%"),
    height: hp(7),
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center",
    paddingHorizontal: "1%"
  },
  detalhesItem1Coluna1: {
    flex: 0.5,
    alignItems: "flex-start"
  },
  detalhesItem1Coluna2: {
    flex: 2,
    alignItems: "flex-start"
  },
  detalhesItem2: {
    justifyContent: "space-between",
    width: wp("97%"),
    height: hp(7),
    backgroundColor: "#F6F6F6",
    flexDirection: "row",
    alignItems:"center"
  },
  detalhesItem2Coluna1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around"
  },
  detalhesItem2Coluna2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
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
    resizeMode: "contain",
    position:"relative",
    left: "20%"
  }
});
