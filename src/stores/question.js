import { defineStore } from "pinia";
const localStorage = window.localStorage;

export const useQuestionStore = defineStore("question", {
  state: () => ({
    questions: [],
    questionNumber: localStorage.getItem("questionNumber"),
    totalQuestions: null,
    currentQuestion: null,
    userReponse: "",
    reponseCorrect: null,
    abandoned: false,
    attempt: localStorage.getItem("attempt"),
    score: localStorage.getItem("score"),
  }),
});
