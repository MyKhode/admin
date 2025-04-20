<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon icon="ri-heart-line" color="error" size="1.25rem" class="mx-1" />
      By <a href="https://ikhode.site" target="_blank" rel="noopener noreferrer" class="text-primary ms-1">Ikhode
        Studio</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a href="https://blog.ikhode.site/docs" target="noopener noreferrer">About</a>
      <a href="https://bio.ikhode.site/" target="noopener noreferrer">Contact</a>
      <a href="https://www.ikhode.site/app" target="noopener noreferrer">All Applications</a>
      <a href="https://www.ikhode.site/top-up" target="noopener noreferrer">Support</a>
    </span>
  </div>
</template>
