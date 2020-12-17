import { AsyncStorage } from "react-native";
import { initDbPromise } from './AuthDB';
//export const USER_KEY = "";
export const onSignOut = () => AsyncStorage.removeItem("user");

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (user !== null) {
      return {
        id: JSON.parse(user).id,
        nome: JSON.parse(user).nome,
        email: JSON.parse(user).email,
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const onSignIn = async (obj) => {
  let sha1 = require('sha1');
  const db = await initDbPromise();
  try {
    if(obj){
      let user = "";
      await db.transaction(async (tx) => {
        const [sql , response] = await tx.executeSql(
          'SELECT * FROM usuarios where email=? AND senha=?',
          [obj.selectedEmail.trim(),sha1(obj.selectedSenha).trim()]);

        if(response.rows.length > 0){
          this.user = response.rows.item(0);
        }else{
          this.user = false;
        }
      });
      if(this.user){
        await AsyncStorage.setItem("user", JSON.stringify(this.user));
        await db.close();
        return true;
      }else{
        await db.close();
        return false;
      }
    }
  } catch (error) {
    console.log(error)
  }
}; 

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("user")
      .then(res => {
        if (res) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};