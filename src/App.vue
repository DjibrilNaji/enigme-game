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
        class="text-lg font-bold text-red-300"
        @click=""
        v-if="!reponseCorrect"
      >
        Abandonner
      </button>

      <div
        class="bg-green-400 pt-1 rounded-2xl duration-300 ease-linear"
        :style="{
          width: `${(score / totalQuestions) * 100}%`,
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

        <p class="mb-4" v-if="reponseCorrect">
          La réponse est : test {{ reponse }}
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
        Score : {{ score }}
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
      totalQuestions: 0,
      currentQuestion: "",
      userReponse: "",
      reponseCorrect: null,
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
        this.userReponse = "";
        this.currentQuestion = this.questions.find(
          (question) => question.id === this.questionNumber
        );
        this.score++;
      } else {
        this.reponseCorrect = false;
      }
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
