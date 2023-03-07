<script setup>
import { useQuestionStore } from "@/stores/question";
// for the user experience
const store = useQuestionStore();
</script>

<template>
  <header class="flex flex-col text-4xl mb-5 text-white">
    <div class="flex justify-center pb-3">Enigmes</div>
    <div class="flex justify-center">
      <button
        type="button"
        class="flex justify-center mx-20 p-1 w-40 bg-green-100 rounded-md text-lg font-bold text-black"
        @click="replayGame"
      >
        Recommencer
      </button>
    </div>
  </header>

  <main v-if="store.currentQuestion">
    <div>
      <span class="flex justify-center">
        <div
          v-if="store.reponseCorrect"
          class="alert alert-success text-xl py-2 px-10"
          role="alert"
        >
          Bravo , continuez !
        </div>
      </span>
      <p class="flex justify-center text-4xl text-green-500">
        Question {{ store.questionNumber }}/{{ store.totalQuestions }}
        <span class="text-red-700 ml-20 hidden">{{ store.countDown }}</span>
      </p>

      <div class="flex flex-col justify-center">
        <button
          type="button"
          class="text-lg m-2 disabled:opacity-75 disabled:cursor-not-allowed hover:underline"
          @click="getResponse"
          v-if="!store.abandoned"
          :disabled="store.attempt < 3"
        >
          Abandonner cette question
        </button>

        <span class="text-xs text-center" v-if="store.attempt < 3"
          >Vous ne pouvez pas abandonner pour le moment (chaque abandon fait
          -1)</span
        >
      </div>

      <div
        class="bg-green-400 pt-1 rounded-2xl duration-300 ease-linear my-4"
        :style="{
          width: `${
            ((store.currentQuestion.id - 1) / store.totalQuestions) * 100
          }%`,
        }"
      ></div>

      <span class="flex justify-center">
        <p class="text-xl w-[50vw]">
          {{ store.currentQuestion.question }}
        </p>
      </span>
      <span class="flex justify-center">
        <div
          v-if="store.reponseCorrect == false"
          class="flex justify-center alert alert-danger text-xl py-2 px-4 my-4"
          role="alert"
        >
          Mauvaise réponse !
        </div>
      </span>

      <form class="flex flex-col items-center" @submit.prevent="checkReponse">
        <input
          type="text"
          class="rounded-md text-black px-8 py-2 my-4"
          placeholder="Réponse"
          v-model="store.userReponse"
        />

        <p class="mb-4" v-if="store.abandoned">
          La réponse est :
          <span class="bg-red-200 p-1 text-black">{{
            store.currentQuestion.reponse
          }}</span>
        </p>

        <button
          type="button"
          class="bg-green-600 rounded-md text-lg font-bold text-white px-10 py-2"
          @click="checkReponse"
        >
          Valider
        </button>
      </form>
    </div>
  </main>

  <main v-else>
    <div class="flex flex-col gap-8 mb-6">
      <p
        class="flex justify-center text-4xl text-green-500"
        v-if="store.score < 5"
      >
        Vous n'avez pas la moyenne ... <br />
        Score : {{ store.score }} /
        {{ store.totalQuestions }}
      </p>

      <p
        class="flex justify-center items-center text-4xl text-green-500"
        v-else
      >
        <span class="mx-4"> Bien joué ! </span>
        <span class="text-xl text-gray-400">
          Score : {{ store.score }} / {{ store.totalQuestions }}</span
        >
      </p>

      <div
        class="bg-green-400 pt-1 rounded-2xl duration-300 ease-linear"
        :style="{
          width: `${(store.score / store.totalQuestions) * 100}%`,
        }"
      ></div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      countDown: 300,
    };
  },

  async mounted() {
    const store = useQuestionStore();

    store.questions = await fetch("/questions.json");
    store.data = await store.questions.json();

    store.questions = store.data;

    store.totalQuestions = store.questions.length;

    // localStorage
    store.questionNumber =
      parseInt(localStorage.getItem("questionNumber")) || 2;
    store.score = parseInt(localStorage.getItem("score")) || 0;
    store.attempt =
      parseInt(localStorage.getItem("attempt", store.attempt)) || 0;

    store.currentQuestion = store.questions.find(
      (question) => question.id === store.questionNumber
    );

    console.log(localStorage);
  },

  methods: {
    checkReponse: function () {
      const store = useQuestionStore();

      if (
        store.userReponse.toLowerCase() ===
        store.currentQuestion.reponse.toLowerCase()
      ) {
        store.reponseCorrect = true;

        store.questionNumber++;
        localStorage.setItem("questionNumber", store.questionNumber);

        store.score++;
        localStorage.setItem("score", store.score);

        store.currentQuestion = store.questions.find(
          (question) => question.id === store.questionNumber
        );

        store.userReponse = null;
        store.abandonner = false;

        store.attempt = 0;
        store.abandoned = false;

        console.log(localStorage);
      } else {
        store.reponseCorrect = false;

        store.attempt++;
        localStorage.setItem("attempt", store.attempt);

        console.log(localStorage);
      }
    },

    getResponse: function () {
      const store = useQuestionStore();

      store.abandoned = true;
      store.score--;
    },

    replayGame: function () {
      const store = useQuestionStore();

      store.reponseCorrect = null;

      store.questionNumber = 1;
      localStorage.setItem("questionNumber", 1);

      localStorage.setItem("score", 0);
      localStorage.setItem("attempt", 0);

      store.currentQuestion = store.questions.find(
        (question) => question.id === store.questionNumber
      );

      console.log(localStorage);
    },

    // countDownTimer() {
    //   if (this.countDown > 0) {
    //     setTimeout(() => {
    //       this.countDown--;
    //       this.countDownTimer();
    //     }, 1000);
    //   } else {
    //     store.currentQuestion = !this.currentQuestion;
    //   }
    // },
  },
  // created() {
  //   this.countDownTimer();
  // },
};
</script>
