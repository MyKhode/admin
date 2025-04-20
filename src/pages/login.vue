<script setup lang="ts">
import { useTheme } from 'vuetify'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { isAuthenticated } from '@/auth'

import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const vuetifyTheme = useTheme()
const router = useRouter()
const isPasswordVisible = ref(false)
const errorMessage = ref<string | null>(null)

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

// Handle form submission
const handleSubmit = () => {
  // Get credentials from .env
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  // Validate credentials
  if (form.value.email === adminEmail && form.value.password === adminPassword) {
    // Set global authenticated state
    isAuthenticated.value = true
    errorMessage.value = null
    router.push('/dashboard')
  } else {
    // Show error message
    errorMessage.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <!-- <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-3">
          <div class="d-flex" v-html="logo" />
          <h2 class="font-weight-medium text-2xl text-uppercase">
            Admin Dashboard
          </h2>
        </RouterLink>
      </VCardItem> -->

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          Welcome to Ikhode Admin Dashboard! 👋🏻
        </h4>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- Error message -->
            <VCol cols="12" v-if="errorMessage">
              <VAlert type="error" class="mb-4">
                {{ errorMessage }}
              </VAlert>
            </VCol>

            <!-- Email -->
            <VCol cols="12">
              <VTextField v-model="form.email" label="Email" type="email" autocomplete="email" />
            </VCol>

            <!-- Password -->
            <VCol cols="12">
              <VTextField v-model="form.password" label="Password" placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'" autocomplete="current-password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />

              <!-- Login button -->
              <VBtn block type="submit" class="mt-6">
                Login
              </VBtn>
            </VCol>

            <!-- Create account -->
            <!-- <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol> -->

            <!-- Auth providers -->
            <!-- <VCol cols="12" class="text-center">
              <AuthProvider />
            </VCol> -->
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />

    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
