
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

rank();

//シャッフルアルゴリズム
while (a) {
    var j = Math.floor(Math.random() * a);
    var t = arr[--a];
    arr[a] = arr[j];
    arr[j] = t;
}

var first = arr[0],second = arr[1],third = arr[2],fourth = arr[3];

//答え表示
 document.writeln("答え:"+first+second+third+fourth);

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
            $('#setumei,#back,#Graph').stop().fadeOut(1000,function(){
                $('.home').fadeIn(1000);
            });
        });

        $('#startbtn').on('click',function(){
            if(set==0){
                set = 1;
            }else{
                return false;
            }
            var database = firebase.database();
            var dataRef = database.ref('/' + idm);
            dataRef.once("value").then(function (snapshot) {
                var money1 = snapshot.child("money").val();

                if(mode == 1){
                    point1 = -10;
                }else{
                    point1 = -50;
                }

                if((money1+point1)>= 0){

                    if(mode == 1){
                    $('#userfourth').css({'display':'none'});
                    }

                    ModeSet = 1;
                    $('.home,#log').stop().fadeOut(1000,function(){
                        $('.output,#rebtn').fadeIn(1000);
                        db();
                        setTimeout(reload, 500);
                        set = 0;
                    });

                }else{
                    alert("お金がありません");
                    set = 0;
                }
            });
        });       
});

//ゲーム
function checkGuess(){

    var eatcount = 0;
    var bitcount = 0;
    var check = 0;

    var hitAudio = document.getElementById('hitSound');
    var missAudio = document.getElementById('missSound');
    var reAudio = document.getElementById('reSound');
    var gameOver = document.getElementById('gameOverSound');
    var lastAudio = document.getElementById('lastSound');

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
               
                missAudio.currentTime = 0;   
                restPlay -= 1; 
                playCounter += 1;
                missAudio.play();

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
                
                if(mode == 1){
                    guesses[playCounter].innerHTML = "<br>"+ (playCounter+1)+"回目<br>" + userguess[0] + userguess[1] + userguess[2]+"<br>"+eatcount+"E"+bitcount+"B"; 
                }else{
                    guesses[playCounter].innerHTML = "<br>"+ (playCounter+1)+"回目<br>" + userguess[0] + userguess[1] + userguess[2]+ userguess[3]+"<br>"+eatcount+"E"+bitcount+"B"; 
                }
                playman.innerHTML =  "残り"+restPlay + "回";  
                    
                $('#player').fadeIn(1000);          
                $('#guessfield'+playCounter).fadeIn(1000);
                set=0;

                if( CheckHit() ){
                    setTimeout(function(){
                        if(mode == 1){
                            point1 = 30;
                        }else{
                            point1 = 100;
                        }
                        db();
                        setTimeout(reload, 500);
                        $('.slide').slideUp();
                        $('#hittext').fadeIn(5000);
                        $('#wrapper').css({"background":"url('img/hit.jpg')",'background-size':'cover', 'background-attachment':'fixed','background-repeat': 'no-repeat'});
                        hitAudio.play();  
                    },2000);
                }else if(restPlay == 0){
                    set = 1;
                    setTimeout(function(){
                        $('.slide').slideUp();
                        
                        gameOver.play();

                            $('#gameOvertext').stop().fadeIn(5000,function(){
                                if(ContCount == 0){
                                    $('#ContinueBtn').fadeIn(1000); 
                                }
                            });

                    },2000);
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

// ここから挿入処理
function db1() {
    var hantei;
    var idm = "eccbc87e4b5ce2fe"; // ここにユーザのIDを入れる、本番はカードリーダから取得したIDが入る
    var database = firebase.database(); //firebaseのデータベースを使う事を変数で定めている
    var dataRef = database.ref('/' + idm); // 取得するデータの項目名を定めている。プログラムには「'/'+user」は「/ユーザーID」に見えている。
    var nameInput = document.getElementById("nameInput1").value
    dataRef.once("value").then(function (snapshot) {
      hantei = snapshot.child("name").val();
      console.log("hantei:" + hantei);
      console.log("input:"+nameInput);

      if (hantei != undefined || nameInput == "") {
        console.log("出来ねえ");
        alert('名前が入力されていない、もしくは新規登録ではないため登録できません。');
      } else {
        console.log("出来た");
        var commentsRef = firebase.database().ref(idm); // 挿入する際の項目名を指定
        commentsRef.set({ name: nameInput, money: 100 }); // nameにnameInputに入力した値が、moneyにmoneyInputに入力した値が挿入される
      }
    });
};
  // ここまで挿入処理

  //データ削除
function db2() {
    var idm = "eccbc87e4b5ce2fe"; // ここにユーザのIDを入れる
    var commentsRef = firebase.database().ref(idm); // 挿入する際の項目名を指定
    commentsRef.set({ name: null, money: null }); // nameにnameInputに入力した値が、moneyにmoneyInputに入力した値が挿入される
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

//modeset
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
    //alert("hannnousitemasu");
    if(mode == 1){
        point1=-15;
    }else{
        point1=-50;
    }
    var database = firebase.database();
    var dataRef = database.ref('/' + idm);
    dataRef.once("value").then(function (snapshot) {
        var money1 = snapshot.child("money").val();
        if((money1+point1)> 0){
            $('#gameOvertext,#ContinueBtn').fadeOut(1000);
            ContCount = 1;
            restPlay = 5;
            playman.innerHTML =  "残り"+restPlay + "回";  
            set = 0;
            db();
            setTimeout(reload, 500);
            setTimeout(function(){
                $('.slide').fadeIn(2000);
            },1000);
        }else{
            alert("お金が足りません");
        }
    });
}
/*ハート
function HeartClick(){
    click++;
    $('#heart'+click).fadeIn(2000);
    if(click == 1){
        mode = 1;
    }else if(click == 4){
        mode = 2;
    }
}
*/
