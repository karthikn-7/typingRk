var global = {};
var wcc = 0;
var time = 0;

function comparText(){
    let typingObject = {};
    var questionText = $("#questionText").val();
    var typedText = $("#typedAnswer").val();

    
    let splittedQuesText = questionText.split(/\s+/);
    let splittedAnsText = typedText.split(/\s+/);
    
    typingObject["questionText"] = questionText;
    typingObject["typedText"] = typedText;

    typingObject["Question Array"] = splittedQuesText;
    typingObject["Answer Array"] = splittedAnsText;

    global["typingObject"] = typingObject;

    if(typedText === questionText){
        window.alert("Complete! Word per minute: "+Number(splittedAnsText.length/time*60))
        window.location.reload()
    }else{
        console.log("inside else")
        if(typedText.charAt(typedText.length-1) !== questionText.charAt(typedText.length-1)){
            wcc++;
            $("#typedAnswer").val(typedText.slice(0,typedText.length-1))
            console.log(wcc)
        } 
        $("#wpm").text("Word per minute: "+Number(splittedAnsText.length/time*60))
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
})