import $ from "jquery";
import "./css/index.css";
import "./css/1.less";
import "./css/1.scss";

$(function () {
  $("li:odd").css("background", "lightblue");
  $("li:even").css("background", "lightgreen");
});

// ************
import Vue from "vue";
import App from "./components/App.vue";

const vm = new Vue({
  el: "#app",
  render: (h) => h(App),
});
