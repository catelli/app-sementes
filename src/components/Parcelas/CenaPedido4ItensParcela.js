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
import { View, Text, StyleSheet, TextInput } from "react-native";
import { TextInputMask } from 'react-native-masked-text';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default class CenaPedido4ItensParcela extends Component {

  state = {
    dataVencimento: "",
    parcelaPercentual: ""
  };

  formatPercentual(value) {
    value = value.toString().trim();                                                         
    value = value.replace(new RegExp('[,]','gi'), '');
    value = value.replace(new RegExp('[-]','gi'), '');
    value = value.replace(new RegExp('[.][.]','gi'), '');
    value = value.replace(new RegExp('[.][.][.]','gi'), '');
    return value;   
  }

  render() {
    return (
    <View style={styles.viewInputsParcelas}>
    <Text style={styles.txtParcela}>Parcela {this.props.indice}</Text>
      <View style={styles.viewValorData}>
        <View style={styles.viewValorDataParcela1}>
          <View style={styles.viewNewPickerParcelas1}>       
          <TextInputMask
            type={'datetime'}
            style={{color: '#925E33', fontSize: wp("4.5%"), marginTop:"5%"}}
            placeholder="Data"
            placeholderTextColor="#925E33"
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={this.state.dataVencimento}
            onChangeText={(dataVencimento) => {
                this.setState({dataVencimento});
                this.props.addParcelas(dataVencimento, null, this.props.indice);
            }}
          />
          </View>
        </View>
        <View style={styles.viewValorDataParcela2}>
          <View style={styles.viewNewPickerParcelas2}>       
            <TextInput
                keyboardType={"decimal-pad"}
                style={{color: '#925E33', fontSize: wp("4.5%"), marginTop:"2.5%"}}
                underlineColorAndroid="transparent"
                placeholder="Percentual %"
                placeholderTextColor="#925E33"
                value={`${this.state.parcelaPercentual}`}
                onChangeText={(parcelaPercentual) => {
                  let parcelaPassada = this.formatPercentual(parcelaPercentual);
                  this.setState({parcelaPercentual: parcelaPassada});
                  this.props.addParcelas(null, parcelaPassada, this.props.indice);
                }}
            />
          </View>
        </View>
      </View>
    </View>  
    );
  }
}

const styles = StyleSheet.create({
  viewInputsParcelas: {
    flex: 1,
    height: hp("16%"),
    flexDirection:"column",
    backgroundColor: "#EEEEEE",
    borderColor: "#DDDDDD",
    borderWidth: 1,
    paddingVertical: "2%",
    marginVertical:"1.5%"
  },
  txtParcela: {
    fontSize: wp("4.5%"),
    fontFamily:"Roboto-Regular",
    fontWeight:"500",
    color:"#716ACA",
    textAlign:"left",
    justifyContent:"flex-start",
    alignItems:"flex-start",
    marginLeft:"2.5%"
  },
  viewValorData:{
    flexDirection:"row",
    alignItems:"flex-end",
    paddingBottom:"2%"
  },
  viewValorDataParcela1:{
    flex:0.6,
    alignItems:"center"
  },
  viewValorDataParcela2:{
    flex:1,
    alignItems:"center"
  },
  viewNewPickerParcelas1: {
    backgroundColor:"#FFF",
    width: wp("32%"),
    height: hp("8.5%"),
    borderColor: "#DDDDDD",
    borderWidth: 1,
    marginLeft:"4%",
  },
  viewNewPickerParcelas2:{
    backgroundColor:"#FFF",
    width: wp("50%"),
    height: hp("8.5%"),
    borderColor: "#DDDDDD",
    borderWidth: 1,
    marginLeft:"6.5%",
  }, 
  inputSearch: {
    flex: 1,
    fontSize: wp("4.5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#979c9c"
  }
});
