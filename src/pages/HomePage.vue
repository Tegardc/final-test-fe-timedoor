<template>
  <hero-section></hero-section>
  <section class="container py-5">
    <div class="d-flex justify-content-between align-items-center">
      <h2>Popular Items</h2>
      <router-link
        to="/products/"
        href="products.html"
        class=""
        style="color: black"
        >See all</router-link
      >
    </div>
    <div class="row row-cols-5 g-2 py-3 justify-content-start">
      <product-card
        v-for="product in mostPopularProductList"
        :key="product.id"
        :product="product"
      ></product-card>
      <div>
        <router-link
          class="card product-card position-relative text-muted"
          to="/products/"
          style="background-color: black"
        >
          <span style="color: white">See All Products</span>
          <i class="fa-solid fa-eye mt-2" style="color: white"></i>
        </router-link>
      </div>
    </div>
  </section>
  <section class="container py-5">
    <div class="d-flex justify-content-between align-items-center">
      <h2>Tattoo Category</h2>
    </div>
    <div class="d-flex py-3 justify-content-start">
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Japanese
      </button>
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Old School
      </button>
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Black Worm
      </button>
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Triball
      </button>
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Geometry
      </button>
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Realistic
      </button>
      <button type="button" class="btn btn-outline-secondary me-2 px-5">
        Balinese
      </button>
    </div>
  </section>
  <section class="container py-5">
    <div class="d-flex justify-content-between align-items-center">
      <h2>New Product</h2>
      <router-link
        to="/products/"
        href="products.html"
        class=""
        style="color: black"
        >See all</router-link
      >
    </div>
    <div class="row row-cols-5 g-2 py-3 justify-content-start">
      <product-card
        v-for="product in newProductList"
        :key="product.id"
        :product="product"
      ></product-card>
      <div>
        <router-link
          class="card product-card position-relative text-black"
          to="/products/"
          style="background-color: black"
          ><span style="color: white">See All Products</span>
          <i class="fa-solid fa-eye mt-2" style="color: white"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import HeroSection from '@/components/ui/HeroSection.vue'
import ProductCard from '@/components/ui/ProductCard.vue'

import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const productListStatus = ref(false)
const productList = ref()
const mostPopularProductList = ref()
const newProductList = ref()

onMounted(async () => {
  try {
    await store.dispatch('product/getProductData')
    productListStatus.value = true
    productList.value = store.state.product.products
    mostPopularProductList.value = Object.values(
      store.state.product.products,
    ).slice(0, 4)
    newProductList.value = Object.fromEntries(
      Object.entries(store.state.product.products).slice(-4),
    )
  } catch (error) {
    console.error('Error fetching product data:', error)
  }
})
</script>
<style></style>
