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

import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  ImageBackground
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';

const dimension = Dimensions.get("window");
const atualizar = require("../../imgs/atualizar.png");
const clientes = require("../../imgs/clientes.png");
const enviar = require("../../imgs/enviar.png");
const pedidos = require("../../imgs/pedidos.png");
const out = require("../../imgs/out.png");

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: dimension.width,
    height: dimension.height
  },
  backgroundImg: {
    /*flex: 1,*/
    width: dimension.width,
    height: dimension.height,
    /*justifyContent: "center"*/
  },
  topo: {
    flex: 0.5,
    height: hp("8.5%"),
    borderBottomWidth: 0.5,
    paddingHorizontal: "5%",
    borderBottomColor: "#fff",
    justifyContent: "center"
  },
  txtNome: {
    color: "#FFF",
    textAlign: "left",
    fontSize: wp("6%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    letterSpacing: 1
  },
  container: { padding: "5%" },
  elementoContainer: {
    marginVertical: "8%"
  },
  elemento1: {
    width: wp("8%"),
    height: hp("4%"),
    resizeMode: "stretch"
  },
  elemento2: {
    width: wp("7%"),
    height: hp("5%"),
    resizeMode: "stretch"
  },
  elemento3: {
    width: wp("9%"),
    height: hp("5%"),
    resizeMode: "stretch"
  },
  elemento4: {
    width: wp("8%"),
    height: hp("5%"),
    resizeMode: "stretch"
  },
  elemento5: {
    width: wp("7%"),
    height: hp("4%"),
    resizeMode: "stretch"
  },
  name: {
    position: "absolute",
    left: "13%",
    top: "2%"
  },
  item: {
    fontSize: wp("5%"),
    fontWeight: "300",
    fontFamily: "Roboto-Regular",
    color: "#FFF",
    letterSpacing:1
  },
  rodape: {
    marginTop: "9%"
  }
});

export default function MenuPrincipal({ navigation, logado , logout }) {
  return (
    <ImageBackground
      style={styles.backgroundImg}
      source={require("../../imgs/background.png")}
    >
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.topo}>
        <Text style={styles.txtNome}>{logado?logado.nome:null}</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate("atualizaDados")}>
            <View style={styles.elementoContainer}>   
                <Image style={styles.elemento1} source={atualizar} />
                <Text style={[styles.item, styles.name]}>
                  Atualizar
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("meusClientes")}>
            <View style={styles.elementoContainer}>
                <Image style={styles.elemento2} source={clientes} />
                <Text style={[styles.item, styles.name]}>
                  Clientes Inseridos
                </Text>     
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("enviarPedidosClientes")}>
            <View style={styles.elementoContainer}>
                <Image style={styles.elemento3} source={enviar} />
                <Text style={[styles.item, styles.name]}>
                  Enviar Dados
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("meusPedidos")}>
            <View style={styles.elementoContainer}>
                <Image style={styles.elemento4} source={pedidos} />
                <Text style={[styles.item, styles.name]}>
                  Meus Pedidos
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()}>
            <View style={[styles.elementoContainer, styles.rodape]}>
                <Image style={styles.elemento5} source={out} />
                <Text style={[styles.item, styles.name]}>
                  Sair
                </Text>        
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
