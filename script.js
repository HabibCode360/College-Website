const togler = document.getElementById("themeTogler"),
  themePicker = document.getElementById("themePicker");
togler.addEventListener("click", function (e) {
  themePicker.classList.contains("light")
    ? ((togler.firstElementChild.innerHTML = "Dark"),
      themePicker.classList.replace("light", "dark"))
    : (themePicker.classList.replace("dark", "light"),
      (togler.firstElementChild.innerHTML = "Light"));
});
