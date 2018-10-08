
var arr = [0,1,2,3,4,5,6,7,8,9];
var a = arr.length;
var userguess =new Array(2);
var restPlay = 10;
var playCounter = -1;
var set=0;
var bgm = 0;
var click = 0;
var mode = 1;
var point1 = 0;
var ModeSet = 0;
var ContCount = 0;
var timer1;
var time=0;
var timerset = 0;
var first=0;
var second=0;
var third=0;
var fourth=0;
var minCopy;
var secCopy;
var guest = 0;
rank();

//シャッフルアルゴリズム
function make(){
    arr = [0,1,2,3,4,5,6,7,8,9];
    a = arr.length;
    while (a) {
        var j = Math.floor(Math.random() * a);
        var t = arr[--a];
        arr[a] = arr[j];
        arr[j] = t;
        first = arr[0],second = arr[1],third = arr[2],fourth = arr[3];
    }
}

make();

$('#wrapper').css({"background":"url('img/Shrine.jpg')",'background-size':'cover','background-repeat':'no-repeat','background-attachment':'fixed'});

$(document).ready(function(){
    $('.anime').hover(function() {
        $(this).stop().animate({'marginLeft':'10px'}, 300);
    },function() {
        $(this).stop().animate({'marginLeft':'0px'}, 300);
    });  
});

//タイトル
$(function(){
    document.getElementById("kotae").innerHTML = "答え:"+first+second+third+fourth;
    $('#setumeibtn').on('click',function(){

        if(set==0){
            set = 1;
        }else{
            return false;
        }

        $('.home').stop().fadeOut(1000,function(){
            $('#setumei').fadeIn(1000);
            $('#back').fadeIn(1000);
            $('#Graph').fadeIn(1000);
            set = 0;
        });
    });

    $('#back').on('click',function(){
        //$('#back,#Graph').fadeOut(1000);
        $('#setumei,#back').stop().fadeOut(1000,function(){
            $('.home').fadeIn(1000);
           
        });
    });

    $('#startbtn').on('click',function(){
       if(guest == 1){
            cntStart();

            if(mode == 1){
                $('#userfourth').css({'display':'none'});
            }else{
                $('#userfourth').css({'display':'inline'});
            }

            ModeSet = 1;
            $('.home,.log').stop().fadeOut(1000,function(){
                $('.output,#timer').fadeIn(1000);
                set = 0;
            });

        }else{
            ProductionStart();
        }
    });       
});

//ゲーム
function checkGuess(){

    var eatcount = 0;
    var bitcount = 0;
    var check = 0;

    var hitAudio = document.getElementById('hitSound');
    var missAudio = document.getElementById('missSound');
    var kamiAudio = document.getElementById('kamiSound');
    var reAudio = document.getElementById('reSound');
    var gameOver = document.getElementById('gameOverSound');
    var lastAudio = document.getElementById('lastSound');
    var hanabiAudio = document.getElementById('hanabiSound');

    userguess[0] = document.getElementById("userfirst").value;
    userguess[1] = document.getElementById("usersecond").value;
    userguess[2] = document.getElementById("userthird").value;
    userguess[3] = document.getElementById("userfourth").value;
    
    playman = document.getElementById("player");
    
    var guesses = new Array();

    for(var i = 0;i<15;i++){
        guesses[i] = document.getElementById("guessfield"+i);
    }
    
    if(mode == 1){
        if(userguess[0] == userguess[1] || userguess[1] == userguess[2] || userguess[0] == userguess[2]){
            check = 1;
        }
    }else{
        for(var i=1;i<=3;i++){
            if(userguess[0] == userguess[i]){
                check = 1;
            }
        }

        if(check == 0){
            if(userguess[1] == userguess[2]){
                check = 1;
            }else if(userguess[1] == userguess[3]){
                check = 1;
            }else if(userguess[2] == userguess[3]){
                check = 1;
            }
        }
    }

    if(check == 1){
        reAudio.play();
        alert("同じ数値をつかわないでください");
    }else{ 
 
        if(set==0){
            set=1; 
        }else{
        return false;
        }

       if(restPlay == 2){
           lastAudio.play();
       }
        
       $(function(){
           $('#player').stop().fadeOut(1000,function(){ 
                restPlay -= 1; 
                playCounter += 1;
                kamiAudio.play();

                for(var i=0;i<(mode+2);i++){
                    for(var j=0;j<(mode+2);j++){
                        if(userguess[i]==arr[j]){
                            bitcount += 1;
                        }
                    }
                }  
                    
                for(var i=0;i<(mode+2);i++){
                    if(userguess[i]==arr[i]){
                        eatcount += 1;
                    }
                }
                
                bitcount = bitcount-eatcount;

                if(mode == 1){
                    guesses[playCounter].innerHTML = (playCounter+1)+"回目<br>" + userguess[0] + userguess[1] + userguess[2]+"<br>"+eatcount+"E"+bitcount +"B"; 
                }else{
                    guesses[playCounter].innerHTML = (playCounter+1)+"回目<br>" + userguess[0] + userguess[1] + userguess[2]+ userguess[3]+"<br>"+eatcount+"E"+bitcount+"B"; 
                }
                playman.innerHTML =  "残り"+restPlay + "回";  
                    
                $('#player').fadeIn(1000);          
                $('#guessfield'+playCounter).fadeIn(1000);
                set=0;

                if( CheckHit() ){
                    setTimeout(function(){
                       if(guest == 0){
                            if(mode == 1){
                                point1 = 20;
                            }else{
                                point1 = 100;
                            }
                            db();
                            setTimeout(reload, 500);
                        }
                        clearInterval(timer1);
                        $('.guessfield,.guessfield2,.output,#player,#timer').slideUp();
                        $('#hittext').fadeIn(5000);
                        $('#wrapper').css({"background":"url('img/hit.jpg')",'background-position': 'center center','background-size':'cover', 'background-attachment':'fixed','background-repeat': 'no-repeat'});
                        hitAudio.play(); 
                        setTimeout(function(){hanabiAudio.play()}, 1500);
                        $('#resetbtn').fadeIn(1000);
                       
                    },1000);
                }else if(restPlay == 0){
                    set = 1;
                    clearInterval(timer1);
                    setTimeout(function(){
                        $('.guessfield,.guessfield2,.output,#player,#timer').slideUp();

                        
                        gameOver.play();

                            $('#gameOvertext').stop().fadeIn(5000,function(){
                                if(ContCount == 0){
                                    $('#ContinueBtn').fadeIn(1000); 
                                }
                                //$('#resetbtn').fadeIn(1000);
                                $('#resultbtn').fadeIn(1000);
                                if(timerset == 1){
                
                                    while(playCounter < 10){
                                    guesses[playCounter].innerHTML = "罰<br>" +"罰<br>"+"罰"; 
                                    playCounter++;
                                    }
                                    
                                }
                            });
                    },1000);
                   
                }else{
                     
                    setTimeout(function(){
                    missAudio.currentTime = 0;   
                    missAudio.play();
                    },1000);
                }
            });
        });
    }
}

// IDの読み込み
function printIDm() {
    if(set==0){
        set=1; 
    }else{
        return false;
    }
    var idm = getIDm();
    var database = firebase.database();
    var dataRef = database.ref('/' + idm);
    dataRef.once("value").then(function (snapshot) {
        $(function(){
            $('#Point,#UserName').stop().fadeOut(1000,function(){
            document.getElementById("UserName").innerHTML = snapshot.child("name").val();
            document.getElementById("Point").innerHTML =  snapshot.child("money").val();
            document.getElementById("startbtn").style.display = "inline";
            $('#Point,#UserName').fadeIn(1000);  
            set=0;
            });
        });    
    });
}

// テストID読み込み
function printIDmDummyWithoutServer() {
    if(set==0){
        set=1; 
    }else{
        return false;
    }
    guest = 0;
    var database = firebase.database();
    var seed = "3";
    idm = getIDmDummyWithoutServer(seed);
    var dataRef = database.ref('/' + idm);
    dataRef.once("value").then(function (snapshot) {
        $(function(){
            $('#Point,#UserName').stop().fadeOut(1000,function(){
            document.getElementById("UserName").innerHTML = snapshot.child("name").val();
            document.getElementById("Point").innerHTML = snapshot.child("money").val();
            $('#Point,#UserName,#startbtn').fadeIn(1000); 
            set=0;
            });
        });
    });
}  

//ゲストプレイ
function guestplay(){
    if(set==0){
        set=1; 
    }else{
        return false;
    }
    guest = 1;
    $(function(){
        $('#Point,#UserName').stop().fadeOut(1000,function(){
        document.getElementById("UserName").innerHTML = "ゲスト";
        document.getElementById("Point").innerHTML =  "ゲスト";
        $('#Point,#UserName,#startbtn').fadeIn(1000); 
        set=0;
        });
    });   
}

// 画面更新
function reload() {
    var database = firebase.database();
    var dataRef = database.ref('/' + idm);
    dataRef.once("value").then(function (snapshot) {
        $(function(){
            $('#Point').stop().fadeOut(1000,function(){
                document.getElementById("UserName").innerHTML = snapshot.child("name").val();
                document.getElementById("Point").innerHTML =  snapshot.child("money").val();
                $('#Point').fadeIn(1000);  
            });
        });     
    });
}

// ポイント増減
function db() {
    var database = firebase.database();
    var dataRef = database.ref('/' + idm);
    dataRef.once("value").then(function (snapshot) {
        var money1 = snapshot.child("money").val();
        var updates = {};
        updates['/' + idm + '/money'] = money1 + point1;
        return firebase.database().ref().update(updates);
    });
}

// ログアウト
function logout() {
    idm = null;
    if (idm == null) { document.getElementById("startbtn").style.display = "none"; }
    document.getElementById("UserName").innerHTML = 'ログインしてください';
    document.getElementById("Point").innerHTML = 'ログインしてください';
}

function DoubleClick(){
    if(set==0){
        set=1; 
    }else{
        return false;
    }
}
  //ランキング
window.onload = function(){
    //1000ミリ秒（1秒）毎に関数「showNowDate()」を呼び出す
    setInterval("rank()",5000);
}
  var i= 5;

      // データを高い物から5個取得し昇順で表示
function rank() {
    console.log("画面更新");
    firebase.database().ref('/').orderByChild('money').limitToLast(5).on("child_added", function (snapshot) {
        document.getElementById("rank_"+i).innerHTML = i + "位　" +snapshot.val().name + "さん ： " + snapshot.val().money + " ポイント";
        i --;
    });
    i = 5;
}

function check() {
    if (event.keyCode != 122 && event.keyCode >= 112 && event.keyCode <= 123) {
        event.keyCode = 0;
        return false;
    }
}
window.document.onkeydown = check;

//BGM
function bgmswitch(){
    var bgmsound = document.getElementById('bgm');
    if(bgm == 0){
        bgmsound.play(); 
        bgm = 1;
       $('#bgmid').val('BGM：OFF');
    }else{
        bgmsound.pause();
        bgmsound.currentTime = 0;
        bgm = 0;
        $('#bgmid').val('BGM：ON');
    }
    
}

//HIT確認
function CheckHit(){
     
    if(mode == 1){
        if(userguess[0] == first　&& userguess[1] == second && userguess[2] == third){
            return true;
        }else{
            return false;
        }
    }else{
        if(userguess[0] == first　&& userguess[1] == second && userguess[2] == third && userguess[3] == fourth){
            return true;
        }else{
            return false;
        }
    }
    
}

function gOver(){
    set = 1;
    setTimeout(function(){
        $('.guessfield,.guessfield2,.output,#player').slideUp();
            gameOver.play();
            $('#gameOvertext').stop().fadeIn(5000,function(){
                if(ContCount == 0){
                    $('#ContinueBtn').fadeIn(1000); 
                }
                $('#resetbtn').fadeIn(1000);
            });
    },1000);
}

//ゲームモード
function ModeSwitch(){
    
    if(ModeSet == 0){
        if(mode == 1){
            mode = 2;
            $('#ModeBtn').val('難易度：難しい');
        }else{
            mode = 1;
            $('#ModeBtn').val('難易度：普通');
        }
    }
}

//コンテニュー
function Continue(){
    if(guest == 0){
        if(mode == 1){point1=-15;}else{point1=-50;}
        var database = firebase.database();
        var dataRef = database.ref('/' + idm);
        dataRef.once("value").then(function (snapshot) {
            var money1 = snapshot.child("money").val();
            if((money1+point1)> 0){
                ProductionContinue();
                db();
                setTimeout(reload, 500);
            }else{
                alert("お金が足りません");
            }
        });
    }else{
        ProductionContinue();
    }
}  


//タイトルに戻る
function Resetgame(){
    var hanabiAudio = document.getElementById('hanabiSound');
    $('#gameOvertext,#ContinueBtn,#resetbtn, #hittext,.guessfield,.guessfield2').stop().fadeOut(1000,function(){
        restPlay = 10;
        playCounter = -1;
        ContCount = 0;
        ModeSet = 0;
        set = 0;
        hanabiAudio.pause();
        hanabiAudio.currentTime = 0;
        document.sampleform.reset();
        document.getElementById("hun").innerHTML = minCopy; 
        document.getElementById("byou").innerHTML = secCopy;
        make();
        $('#wrapper').css({"background":"url('img/Shrine.jpg')",'background-size':'cover','background-repeat':'no-repeat','background-attachment':'fixed'});
        setTimeout(function(){document.getElementById("kotae").innerHTML = "答え:"+first+second+third+fourth;},1000);
        $('.home,.log').fadeIn(1000);
        $('#resultkotae').fadeOut(1000);
    });
}


//カウントダウン
function cntStart(){
  var min = document.getElementById('hun').textContent;
  var sec = document.getElementById('byou').textContent;
  minCopy = document.getElementById('hun').textContent;
  secCopy = document.getElementById('byou').textContent;
  min = Number(min); 
  sec = Number(sec); 
  time = (min*60+sec);
  timer1=setInterval("countDown()",1000);
}

function countDown(){
   time--;
   tmWrite(time);
}

function tmWrite(int){
   
    if (int<0){
    reSet();
    restPlay = 1;
    alert("時間です！");
    timerset = 1;
    }else{
    document.getElementById("hun").innerHTML = Math.floor(int/60);
    document.getElementById("byou").innerHTML = int % 60;
    }
}

function reSet()
{
  clearInterval(timer1);
}  

function ProductionStart(){
    var database = firebase.database();
    var dataRef = database.ref('/' + idm);

    dataRef.once("value").then(function (snapshot) {
        var money1 = snapshot.child("money").val();

        if(mode == 1){
            point1 = -10;
        }else{
            point1 = -30;
        }

        if((money1+point1)>= 0){
            cntStart();
            if(mode == 1){
                $('#userfourth').css({'display':'none'});
            }else{
                $('#userfourth').css({'display':'inline'});
            }

            ModeSet = 1;

            $('.home,.log').stop().fadeOut(1000,function(){
                $('.output,#timer').fadeIn(1000);
                db();
                setTimeout(reload, 500);
                set = 0;
            });

        }else{
            alert("お金がありません");
            set = 0;
        }
    });
}

function ProductionHit(){
    if(mode == 1){
        point1 = 30;
    }else{
        point1 = 100;
    }
    db();
    setTimeout(reload, 500);
}


function ProductionContinue(){

    var tearAudio = document.getElementById('tearSound');
    $('#gameOvertext,#ContinueBtn,#resultbtn').fadeOut(1000);
    ContCount = 1;
    restPlay = 5;
    if(timerset == 1){ playCounter--;};
    playman.innerHTML =  "残り"+restPlay + "回";  
    set = 0;
    tearAudio.play();
    document.sampleform.reset();
    document.getElementById("hun").innerHTML = 2; 
    document.getElementById("byou").innerHTML = 0;
    time = 120;
    timer1=setInterval("countDown()",1000);
    setTimeout(function(){
        $('.guessfield,.output,#player,#timer').fadeIn(2000);
    },1000);
}

function result(){
    $('#ContinueBtn,#resultbtn').stop().fadeOut(1000,function(){
        $('.guessfield').fadeIn(1000);
        if(mode == 1){
            document.getElementById("resultkotae").innerHTML = "答え:"+first+second+third;
        }else{
            document.getElementById("resultkotae").innerHTML = "答え:"+first+second+third+fourth;
        }
        $('#resultkotae').fadeIn(1000);
        if( ContCount == 1){
            $('.guessfield2').fadeIn(1000);
        }
        $('#resetbtn').fadeIn(1000);
    });
}