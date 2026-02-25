var global = {};
var wcc = 0;
var time = 0;
let wpm = 0;


async function sendDataToBackend(data){
    // WPM = models.IntegerField()
    // UserName = models.CharField(max_length=100)
    // TimeTaken = models.IntegerField()
    // TypingText = models.TextField()
    // AnswerText = models.TextField()
    // Accuracy = models.IntegerField()
    data = {
        "WPM": data.WPM,
        "TimeTaken": time,
        "TypingText": data.questionText,
        "AnswerText": data.typedText,
        "Accuracy": data.Accuracy,
        "questionText": data.questionText,
    }
    let response = await fetch("http://127.0.0.1:8000/api/typing/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    console.log(response)
    // let response = await response.json();
    if(response.status === 201){
        console.log("Data sent successfully:", response)
        window.alert("Complete! Word per minute: "+wpm+"\nAccuracy: "+Number(data.Accuracy)+"\nData saved successfully!")
        window.location.reload()
    }else{
        // throw new Error("Failed to send data: " + response.statusText)
        console.log("Data saved locally but failed to sync: " + response.statusText)
        window.alert("Complete! Word per minute: "+wpm+"\nAccuracy: "+Number(data.Accuracy)+"\nData saved locally but failed to sync: " + response.statusText)
        window.location.reload()
    }
    // .catch(error => {
    //     console.error("Error sending data:", error)
    //     window.alert("Data saved locally but failed to sync: " + error.message)
    //     window.location.reload()
    // })
}

function comparText(){
    let typingObject = {};
    var questionText = $("#questionText").val();
    var typedText = $("#typedAnswer").val();
    let Accuracy = (typedText.length-wcc)/typedText.length * 100

    
    let splittedQuesText = questionText.split(/\s+/);
    let splittedAnsText = typedText.split(/\s+/);
    
    typingObject["questionText"] = questionText;
    typingObject["typedText"] = typedText;

    typingObject["Question Array"] = splittedQuesText;
    typingObject["Answer Array"]
     = splittedAnsText;

    global["typingObject"] = typingObject;

    if(typedText === questionText){
        typingObject["Accuracy"] = Number(Accuracy);
        typingObject["WPM"] = wpm;
        typingObject["WrongCharacterCount"] = wcc;
        sendDataToBackend(typingObject)

    }else{
        console.log("inside else")
        if(typedText.charAt(typedText.length-1) !== questionText.charAt(typedText.length-1)){
            wcc++;
            $("#typedAnswer").val(typedText.slice(0,typedText.length-1))
            console.log(wcc)
        } 
        wpm = Number(splittedAnsText.length/time*60)
        $("#wpm").text("Word per minute: "+ wpm)
    }
    
    global.typingObject["Accuracy"] = Number(Accuracy);
    global.typingObject["WPM"] = wpm;
}



async function fetchAndDisplayHistory(){
    try {
        let response = await fetch("http://127.0.0.1:8000/api/typing/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        if(response.ok){
            let historyData = await response.json()
            let historyList = $("#historyList");
            historyList.html(""); // Clear previous data
            
            // Loop through all history records
            for(let i = 0; i < historyData.length; i++){
                let record = historyData[i];
                let historyItem = `
                    <div class="historyItem">
                        <p><strong>Record ${i + 1}</strong></p>
                        <p><strong>WPM:</strong> ${record.WPM}</p>
                        <p><strong>Accuracy:</strong> ${record.Accuracy}%</p>
                        <p><strong>Time Taken:</strong> ${record.TimeTaken} seconds</p>
                        <p><strong>Your Text:</strong> ${record.AnswerText}</p>
                        <p><strong>Expected Text:</strong> ${record.TypingText}</p>
                        <p><strong>Attempted On:</strong> ${record.created_at}</p>
                    </div>
                `;
                historyList.append(historyItem);
            }
            
            $("#historyContainer").show();
            
        }else{
            console.error("Failed to fetch history:", response.statusText)
            window.alert("Failed to fetch typing history!")
        }
    } catch(error){
        console.error("Error fetching history:", error)
        window.alert("Error fetching history: " + error.message)
    }
}

$(document).ready(function(){
   $("#start").on("click",()=>{
    if($("#questionText").val()){
        $("#typedAnswer").show().focus()
        $("#typedAnswer").css({"margin":"auto","display":"block"})
        setInterval(() => {
            time++;
        },1000);
        $("#typedAnswer").on("input",()=>{
            comparText()
        })
    }
   })
   
   $("#viewHistory").on("click",()=>{
       fetchAndDisplayHistory()
   })
})