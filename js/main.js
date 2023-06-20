const searchSrtring = "http";
const hexRegex = /68747470([0-9A-Fa-f]{2,})/g;
const input = document.getElementById("input");
const output = document.getElementById("output")
function hexToText() {
    let text = "";
    let content = "";
    try {
        let splittedString = splittedStrings(input.value);
        if (input.value === "") output.innerHTML = "";
        for (let i = 0; i < splittedString.length; i++) {
            if (splittedString[i] === "") { continue; } {
                if (splittedString[i].length % 2 !== 0 || !/^[0-9A-Fa-f]+$/g.test(splittedString[i])) throw "Invalid hex encoded string.";
                for (let j = 0; j < splittedString[i].length; j += 2) {
                    let hexPair = splittedString[i].substr(j, 2); // Lấy 2 ký tự Hex liên tiếp
                    let decimalValue = parseInt(hexPair, 16); // Chuyển đổi Hex sang mã Unicode
                    text += String.fromCharCode(decimalValue); // Chuyển đổi mã Unicode sang ký tự
                }
                let match = text.match(searchSrtring) // Kiểm tra có phải liên kết
                if (match) {
                    const link = '<a href="' + text + '" rel="nofollow" target="_blank">' + text + '</a><br>';
                    content += link;
                    output.innerHTML = content;
                    text = "";
                } else {
                    output.innerHTML = text;
                    text = "";
                }
            }
        }
    } catch (error) {
        const warn = '<p style="color: red;">' + error + '</p>';
        output.innerHTML = warn;
        removeError();
    }

}

function textToHex() {
    let text = "";
    for (let i = 0; i < input.value.length; i++) {
        let charCode = input.value.charCodeAt(i).toString(16);
        text += charCode;
      }
    output.innerHTML = text;
}

function openURL() {
    let splittedString = splittedStrings(output.innerHTML);
    for (let i = 0; i < splittedString.length; i++) {
        window.open(splittedString[i]);
    }
}

function pasteData() {
    navigator.clipboard.readText().then(function (text) {
        input.value = text;
        hexToText();
    }).catch(function (error) {
        console.error("Failed to copy text error.", error);
    });
}

function filter() {
    let j = 0;
    let content = input.value;
    let splittedString = splittedStrings(content);
    try {
        document.getElementById('input').value = "";
        for (let i = 0; i < splittedString.length; i++) {
            let match = splittedString[i].match(hexRegex);
            if (match) {
                document.getElementById("input").value += match + "\n";
                j++
            }
        }
        if (j===0) throw "No link hex code found";
        hexToText()
    } catch (error) {
        document.getElementById("error").innerHTML = error;
        removeError();
    }
}

function clean() {
    document.getElementById("input").value = "";
    document.getElementById("output").innerText = "";
}

function checkBox() {
    let checkBox = document.getElementById("isAuto");
    clean()
    if (checkBox.checked == false) {
        input.oninput = null;
    } else {
        if (document.getElementById("select").value == 1) {
            input.oninput = function() { hexToText(); };
        }
        else{
            input.oninput = function() { textToHex(); };
        }
    }
}

function copy(buttonId){
    try {
        if (buttonId === 1) {
            let copy = document.querySelector(".input-text")
            copy.classList.add("active");
            setTimeout(function() {
                copy.classList.remove("active");
            },2500);
            const mydata = input.value;
            const preserver = document.createElement("input");
            preserver.value = mydata;
            navigator.clipboard.writeText(preserver.innerHTML);
            // document.getElementById("error").innerHTML = "Copy successful";
          } else if (buttonId === 2) {
            let copy = document.querySelector(".output-text")
            copy.classList.add("active");
            setTimeout(function() {
                copy.classList.remove("active");
            },2500);
            navigator.clipboard.writeText(document.getElementById("output").innerText);
          }
    } catch (error) {
        document.getElementById("error").innerHTML = error;
        removeError();
    }
}
function splittedStrings(string) {
    var paragraph = string.split("\n");// Chia thành nhiều đoạn
    return paragraph.map(function(paragraph) {
        return paragraph.split(" ").join("");// Xóa khoảng trắng
      });
}
function selectType() {
    let select = document.getElementById("select").value,
        hexdecode = document.getElementById("hexdecode");
    if (select == 2) {
        clean();
        input.placeholder = "Enter String";
        output.dataset.placeholder = "Converted HexaDecimal";
        output.contentEditable = "true";
        document.getElementById("filter").style.display = "none"
        input.oninput = hexdecode.onclick = function() { textToHex(); };
    } else {
        clean();
        input.placeholder = "Enter HexaDecimal";
        output.dataset.placeholder = "Converted String";
        output.contentEditable = "false";
        document.getElementById("filter").style.display = "block"
        input.oninput = hexdecode.onclick = function() { hexToText(); };
    }
}
function removeError() {
    setTimeout(function() {
        document.getElementById("error").innerHTML = "";
    },3000)
}