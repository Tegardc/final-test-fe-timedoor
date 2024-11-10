<template>
  <div class="col-lg-3 mb-4">
    <ul class="list-group mb-2">
      <li class="list-group-item">
        <div class="d-flex align-items-center">
          <img
            :src="
              userData.imageLink ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'
            "
            alt="Profile"
            width="36"
            height="36"
            class="rounded-circle"
            style="object-fit: cover"
          />
          <div class="ps-3">
            <p class="my-0 fs-5 fw-semibold">
              {{ userData.fullname || '-' }}
            </p>
            <p class="my-0 fs-6 text-secondary">{{ userData.email || '-' }}</p>
          </div>
        </div>
      </li>
      <li
        class="list-group-item user-menu"
        @click="menuClicked('personal-info')"
      >
        Personal Info
      </li>
      <li
        class="list-group-item user-menu"
        @click="menuClicked('change-password')"
      >
        Change Password
      </li>
      <li
        class="list-group-item user-menu"
        @click="menuClicked('transaction-history')"
      >
        Transaction History
      </li>
    </ul>
    <ul class="list-group">
      <li class="list-group-item">
        <p class="my-0 fs-5 fw-semibold">My Shop</p>
      </li>
      <li class="list-group-item user-menu" @click="menuClicked('my-products')">
        My Products
      </li>
      <li class="list-group-item user-menu" @click="menuClicked('order-list')">
        Order List
      </li>
    </ul>
  </div>
</template>

<style scoped>
.user-menu:hover {
  cursor: pointer;
}

.active-color {
  color: #4c4ddc;
}

.inactive-color {
  color: #404040;
}
</style>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['changeComponent'])

const menuClicked = option => {
  emit('changeComponent', option)
}

const store = useStore()
const userData = computed(() => {
  return store.state.auth.userLogin
})
</script>
