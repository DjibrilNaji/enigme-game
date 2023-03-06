<script setup></script>

<template>
  <header class="flex justify-center text-4xl mb-5 text-white">
    <div class="pb-3">Enigmes</div>
  </header>

  <main v-if="currentQuestion">
    <div class="flex flex-col gap-8 w-[40vw]">
      <div
        v-if="reponseCorrect"
        class="alert alert-success flex justify-center text-xl p-2"
        role="alert"
      >
        Bravo , continuez !
      </div>

      <p class="flex justify-center text-4xl text-green-500">
        Question {{ questionNumber }}/{{ totalQuestions }}
      </p>

      <button
        type="button"
        class="text-lg font-bold text-stone-400 hover:underline disabled:opacity-75 disabled:cursor-not-allowed"
        @click="getResponse"
        v-if="!abandoned"
        :disabled="attempt < 3"
      >
        Abandonner cette question
        <br />
        <span class="flex justify-center text-sm" v-if="attempt < 3"
          >Vous ne pouvez pas abandonner pour le moment (chaque abandon fait
          -1)</span
        >
      </button>

      <div
        class="bg-green-400 pt-1 rounded-2xl duration-300 ease-linear"
        :style="{
          width: `${((currentQuestion.id - 1) / totalQuestions) * 100}%`,
        }"
      ></div>

      <p class="flex justify-center text-xl">
        {{ currentQuestion.question }}
      </p>

      <div
        v-if="reponseCorrect == false"
        class="alert alert-danger flex justify-center text-xl p-2"
        role="alert"
      >
        Mauvaise réponse !
      </div>

      <form class="flex flex-col items-center" @submit.prevent="checkReponse">
        <div class="flex">
          <input
            type="text"
            class="rounded-md text-black px-8 py-2 mb-4"
            placeholder="Réponse"
            v-model="userReponse"
          />
        </div>

        <p class="mb-4" v-if="abandoned">
          La réponse est :
          <span class="bg-red-200 p-1 text-black">{{
            currentQuestion.reponse
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
      <p class="flex justify-center text-4xl text-green-500">
        Score : {{ score }} / {{ totalQuestions }}
      </p>
      <div
        class="bg-green-400 pt-1 rounded-2xl duration-300 ease-linear"
        :style="{
          width: `${(score / totalQuestions) * 100}%`,
        }"
      ></div>
    </div>

    <button
      type="button"
      class="bg-green-600 rounded-md px-3 py-2 text-lg font-bold text-white mx-32"
      @click="replayGame"
    >
      Recommencer
    </button>
  </main>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      questionNumber: 1,
      totalQuestions: null,
      currentQuestion: null,
      userReponse: null,
      reponseCorrect: null,
      abandoned: false,
      attempt: 0,
      score: 0,
    };
  },

  async mounted() {
    const questions = await fetch("/questions.json");
    const data = await questions.json();

    this.questions = data;
    this.totalQuestions = this.questions.length;

    this.currentQuestion = this.questions.find(
      (question) => question.id === this.questionNumber
    );
  },

  methods: {
    checkReponse: function () {
      if (
        this.userReponse.toLowerCase() ===
        this.currentQuestion.reponse.toLowerCase()
      ) {
        this.reponseCorrect = true;
        this.questionNumber++;
        this.currentQuestion = this.questions.find(
          (question) => question.id === this.questionNumber
        );
        this.score++;

        this.userReponse = null;
        this.abandonner = false;

        this.attempt = 0;
        this.abandoned = false;
      } else {
        this.reponseCorrect = false;
        this.attempt++;
      }
    },

    getResponse: function () {
      this.abandoned = true;
      this.score--;
    },

    replayGame: function () {
      this.reponseCorrect = null;
      this.questionNumber = 1;
      this.currentQuestion = this.questions.find(
        (question) => question.id === this.questionNumber
      );
    },
  },
};
</script>
