function sendInput() {
    var input = document.getElementById("input").value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("output").innerHTML = this.responseText;
      }
    };
    xhr.open("POST", "/handleInput");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("input=" + input);
  }
  