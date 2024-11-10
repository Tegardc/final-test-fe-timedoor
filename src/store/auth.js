import axios from 'axios'
import Cookies from 'js-cookie'
export default {
  namespaced: true,
  state() {
    return {
      token: null,
      tokenExpirationDate: null,
      userLogin: {},
      isLogin: false,
    }
  },
  mutations: {
    setToken(state, { idToken, expiresIn }) {
      state.token = idToken
      state.tokenExpirationDate = expiresIn
      Cookies.set('tokenExpirationDate', expiresIn)
      Cookies.set('jwt', idToken)
    },
    setUserLogin(state, { userData, loginStatus }) {
      state.userLogin = userData
      state.isLogin = loginStatus
    },
    setUserLogout(state) {
      state.token = null
      state.userLogin = {}
      state.isLogin = false
      state.tokenExpirationDate = null
      Cookies.remove('jwt')
      Cookies.remove('tokenExpirationDate')
      Cookies.remove('UID')
    },
  },
  actions: {
    async getRegisterData({ commit, dispatch }, payload) {
      const APIkey = 'AIzaSyC82H-3Z2sgwk0qC2tPfAaVdt8Lm5vnESw'
      const authUrl =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
      try {
        const { data } = await axios.post(authUrl + APIkey, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        })
        commit('setToken', {
          idToken: data.idToken,
          expiresIn:
            new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
        })
        const newUserData = {
          userId: data.localId,
          fullname: payload.fullname,
          username: payload.username,
          email: payload.email,
          imageLink:
            payload.imageLink ||
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
        }

        Cookies.set('UID', newUserData.userId)
        await dispatch('addNewUser', newUserData)
      } catch (err) {
        console.log(err)
      }
    },
    async addNewUser({ commit, state }, payload) {
      try {
        const { data } = await axios.post(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/users.json?auth=${state.token}`,
          payload,
        )
        console.log(data)
        commit('setUserLogin', { userData: payload, loginStatus: true })
      } catch (err) {
        console.log(err)
      }
    },
    async getLoginData({ commit, dispatch }, payload) {
      const APIkey = 'AIzaSyC82H-3Z2sgwk0qC2tPfAaVdt8Lm5vnESw'
      const authUrl =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
      try {
        const { data } = await axios.post(authUrl + APIkey, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        })
        commit('setToken', {
          idToken: data.idToken,
          expiresIn:
            new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
        })
        await dispatch('getUser', data.localId)
        await dispatch('cart/getCartData', null, { root: true })
      } catch (err) {
        console.log(err)
      }
    },
    async getUser({ commit }, payload) {
      try {
        const { data } = await axios.get(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/users.json`,
        )
        for (let key in data) {
          if (data[key].userId === payload) {
            Cookies.set('UID', data[key].userId)
            commit('setUserLogin', {
              userData: data[key],
              loginStatus: true,
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    async updateUserEmail({ state, dispatch }, payload) {
      const APIkey = 'AIzaSyC82H-3Z2sgwk0qC2tPfAaVdt8Lm5vnESw'
      const authUrl =
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key='

      try {
        const { data } = await axios.post(authUrl + APIkey, {
          idToken: state.token,
          email: payload.email,
          returnSecureToken: true,
        })

        // commit('setToken', {
        //   idToken: data.idToken,
        //   expiresIn:
        //     new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
        // })

        const newUpdateData = {
          userId: data.localId,
          fullname: payload.fullname,
          username: payload.username,
          email: payload.email,
          imageLink:
            payload.imageLink ||
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
        }

        await dispatch('updateUser', { newUpdateData })
      } catch (err) {
        console.log('Error updating email:', err)
      }
    },
    async updateUser({ dispatch, rootState }, { newUpdateData }) {
      try {
        const { data } = await axios.put(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/users/${newUpdateData.userId}.json?auth=${rootState.auth.token}`,
          newUpdateData,
        )

        await dispatch('getUser', data.userId)
        alert('Update Successfully')
      } catch (err) {
        console.log(err)
      }
    },
  },
}
