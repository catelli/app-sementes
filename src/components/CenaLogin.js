/* eslint-disable linebreak-style */
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
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ImageBackground,
  Modal,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import axios from "axios";
import SQLite from 'react-native-sqlite-storage';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import { onSignIn } from "./Auth";
import { initDbPromise } from "./AuthDB";

/*let db = SQLite.openDatabase({ 
  name:"petrovina_sementes_v2.8", 
  createFromLocation: '~www/petrovina.sqlite3', 
  location:"Library"
});*/
export default class CenaLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisibility: false,
      dataRegisterUsuarios:[],
      isLoading: false,
      authentication: {
        selectedEmail: "",
        selectedSenha: "",
      }
    };
    /*db.transaction((tx) => {
        tx.executeSql('SELECT * FROM usuarios', [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          dataRegisterUsuarios: temp,
        });
      });
    });*/
  }

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  showLoading() {
    this.setState({ isLoading: true });
  }
  
  hideLoading() {
    this.setState({ isLoading: false });
  }

  selectedLineHeightDimensions = () => {
    if (dimension.width === 1080) {
      return 25;
    } else if (dimension.width === 1600) {
      return 35;
    }
  };

  showCustomAlert(visible) {
    setTimeout(() => {
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
        this.setState({ alertVisibility: visible });
        setTimeout(() => {
          this.setState({ alertVisibility: false });
        }, 3000);
      }, 3000);
    }, 500);
  }

  setMessage(name){
    setTimeout(() => {
      this.hideLoading();
      this.setState({ nameVisibility: name, alertVisibility: true });
      setTimeout(() => {
        this.setState({ alertVisibility: false });
      }, 3000);
    }, 3000);
  }

  async importUsuarios(){
    const db = await initDbPromise();
    this.showLoading();
    try {
      await db.transaction(async (tx) => {
        const [sq, results] = await tx.executeSql('SELECT * FROM usuarios ORDER BY id DESC LIMIT 1');
        const lastUser = results.rows.item(0);
        let idLastUser = "";

        if(lastUser === undefined){
          console.log('passou aqui 1');
          this.idLastUser = null;
        }else{
          console.log('passou aqui 2');
          this.idLastUser = lastUser.id;
        }
        let response = await axios.get(`https://carregamento.petrovina.com.br/api/server/usuarios/${this.idLastUser}`);
        let countResults = response.data.usuarios.length;

        if(countResults > 0){    
          let count = 0;
          await Promise.all(response.data.usuarios.map(async (res) => {
            console.log(res.id);
            await db.executeSql(
              'INSERT INTO usuarios (id,nome,cpf,email,senha) VALUES (?,?,?,?,?)',
                   [res.id, res.nome, res.cpf, res.email, res.senha]
            );
            count++;
            if(count === parseInt(response.data.total)){
              this.setMessage("Usuários");
              await db.close();
            }
          }));
        }else{
          this.hideLoading();
          Alert.alert('Importação não realizada',
             'Não existem dados atualizados para Usuários',
             [
               {text: 'Ok'},
             ],
             { cancelable: false }
           );
        }
        console.log(countResults); 
      });
    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }

  render() {

    //console.log(this.state.authentication);

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.backgroundImg}
          source={require("../../imgs/background.png")}
        > 
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator
              color="#409551"
              size="large"
            />
          </View>
        )}
          <View style={{flex: 0.1, flexDirection: "column", alignItems:"flex-end"}}>
            <TouchableOpacity 
               onPress={() => {this.importUsuarios()}}
            >
              <Image
                style={styles.botaoDownload}
                source={require("../../imgs/download.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewLogo}>
            <Image
              style={styles.logo}
              source={require("../../imgs/logo.png")}
            />
          </View>
          <View style={styles.viewText}>
            <Text adjustsFontSizeToFit style={styles.txtViewText}>
              Aproveite todos os Beneficios do aplicativo de campo Petrovina.
            </Text>
          </View>
          <View style={styles.viewInputs}>
            <TextInput
              disabled={true}
              underlineColorAndroid="transparent"
              placeholder="EMAIL"
              placeholderTextColor="#925E33"
              style={[styles.input, { paddingHorizontal: 10 }]}
              onChangeText={selectedEmail => {
                this.setState(prevState => ({
                  authentication: {                
                      ...prevState.authentication,    
                      selectedEmail: selectedEmail       
                  }
                }))
              }}
            />
            <TextInput
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              placeholder="SENHA"
              placeholderTextColor="#925E33"
              style={[styles.input, { paddingHorizontal: 10 }]}
              onChangeText={selectedSenha => {
                this.setState(prevState => ({
                  authentication: {                
                      ...prevState.authentication,    
                      selectedSenha: selectedSenha       
                  }
                }))
              }}
              value={this.state.authentication.selectedSenha}
            />
          </View>
          <View style={styles.viewRodape}>
            <TouchableHighlight
              style={styles.botaoPedido}
              underlayColor={"#B9C941"}
              activeOpacity={0.3}
              onPress={() => { 
                this.showLoading();
                onSignIn(this.state.authentication)
                  .then((res) => {
                    if(!res){
                      this.hideLoading();
                      this.setState(prevState => ({
                        authentication: {                
                            ...prevState.authentication,    
                            selectedSenha: "",               
                        }
                      }))
                      Alert.alert('Login não realizado',
                        'Favor verificar se a senha ou o email estão corretos.',
                        [
                          {text: 'Ok'},
                        ],
                        { cancelable: false }
                      );
                    }else{
                      this.props.navigation.navigate("MainNav");
                    }
                  }).catch((error) => console.log(error))
              }}
            >
              <Text style={styles.txtBotaoPedido}> ACESSAR </Text>
            </TouchableHighlight>
          </View>
        </ImageBackground>
         {/* MODAL MENSAGEM */}
         <Modal
            visible={this.state.alertVisibility}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <View style={styles.alertMainView}>
                <Text style={styles.alertTitle}>
                  Atualização de Usuários realizada(o) com sucesso!
                </Text>
              </View>
            </View>
          </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  viewTopo: { flex: 1, alignItems: "flex-start", justifyContent: "flex-start" },
  logo: { width: wp(80), height: hp(15), resizeMode: "center" },
  botaoDownload: { height: hp(5), resizeMode: "contain", marginTop: "20%", marginRight:"2%" },
  viewLogo: { flex: 1.1, alignItems: "center", justifyContent: "flex-end" },
  viewText: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    padding: 10
  },
  txtViewText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: hp("3%"),
    lineHeight: this.selectedLineHeightDimensions,
    marginBottom: "5%"
  },
  viewInputs: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    padding: "3%"
  },
  input: {
    fontSize: wp(4),
    width: wp("88%"),
    height: hp(7.5),
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    borderColor: "#DDDDDD",
    borderWidth: 1,
    marginTop: "4.5%",
    color: "#925E33",
    backgroundColor: "#FFF"
  },
  viewRodape: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  botaoPedido: {
    backgroundColor: "#018A3C",
    width: wp("46%"),
    height: hp("10%"),
    marginTop: "2%",
    alignItems: "center",
    justifyContent: "center"
  },
  txtBotaoPedido: {
    fontSize: wp("4.5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#FFF",
    textAlign: "center",
    marginBottom: "5%",

  },

  /* MODAL MENSAGEM */
  alertMainView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#409551",
    height: hp("30%"),
    width: wp("90%"),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#409551",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  alertTitle: {
    fontSize: wp("8%"),
    fontFamily: "Roboto-Regular",
    color: "#fff",
    textAlign: "center",
    padding: "1%",
    height: "auto"
  },

  buttonStyle: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  /* ACTIVITY INDICATOR */
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1

  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp(80)
  }
});
