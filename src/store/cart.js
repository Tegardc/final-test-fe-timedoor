import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      cart: [],
    }
  },
  getters: {},
  mutations: {
    setProductToCart(state, payload) {
      state.cart = payload
    },
    setProductQuantity(state, { productId, quantity }) {
      const product = state.cart.find(product => product.id === productId)
      if (product) {
        product.quantity = quantity
      }
    },
  },
  actions: {
    async getCartData({ commit, rootState }) {
      try {
        const { data } = await axios.get(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/carts.json`,
        )

        const arr = []
        for (let key in data) {
          arr.push({ id: key, ...data[key] })
        }

        const userCart = arr.filter(
          item => item.buyerUserId === rootState.auth.userLogin.userId,
        )

        commit('setProductToCart', userCart)
      } catch (error) {
        console.log(error)
      }
    },

    async addProductToCart({ commit, rootState, dispatch }, payload) {
      const newData = {
        ...payload,
        buyerUsername: rootState.auth.userLogin.username,
        createdAt: Date.now(),
        buyerUserId: rootState.auth.userLogin.userId,
      }
      try {
        const { data } = await axios.post(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/carts.json?auth=${rootState.auth.token}`,
          newData,
        )

        commit('setProductToCart', { id: data.name, ...newData })
        await dispatch('getCartData')
      } catch (err) {
        console.log(err)
      }
    },

    async deleteProductFromCart({ dispatch, rootState }, payload) {
      try {
        await axios.delete(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/carts/${payload}.json?auth=${rootState.auth.token}`,
        )
        await dispatch('getCartData')
      } catch (err) {
        console.log(err)
      }
    },

    async updateProductQuantity(
      { commit, rootState, dispatch },
      { productId, quantity },
    ) {
      try {
        await axios.patch(
          `https://finalproject-750d2-default-rtdb.firebaseio.com/carts/${productId}.json?auth=${rootState.auth.token}`,
          { quantity },
        )
        await dispatch('getCartData')
        await commit('setProductQuantity', { productId, quantity })
      } catch (err) {
        console.log(err)
      }
    },
  },
}
