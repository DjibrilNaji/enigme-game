<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div>Enigmes</div>
  </header>

  <main>
    <div class="flex flex-col gap-8">
      <p class="flex justify-center text-4xl text-green-500">Question 1/5</p>

      <p class="flex justify-center text-xl">
        Comment s'appelle la 1ère princesse créée par Disney ?
      </p>

      <input
        type="text"
        class="rounded-md p-2 text-black"
        placeholder="Réponse"
        aria-label="Réponse"
        aria-describedby="basic-addon2"
      />

      <button
        type="button"
        class="bg-blue-600 rounded-md px-3 py-2 text-lg font-bold text-white"
      >
        Primary
      </button>
    </div>
  </main>
</template>

<style scoped></style>
