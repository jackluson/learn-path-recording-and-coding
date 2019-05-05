/*
* @Author: 18219
* @Date:   2019-05-04 21:27:19
* @Last Modified by:   18219
* @Last Modified time: 2019-05-04 21:42:12
*/

'use strict';
var players = []; // 定义一个数组 保存所有的玩家
function Hero(name,teamColor) {
    this.state = 'live';  // 玩家状态
    this.name = name;     // 角色名字
    this.teamColor = teamColor; // 队伍的颜色
}
Hero.prototype.win = function(){
    // 赢了
    console.log("win:" + this.name);
};
Hero.prototype.lose = function(){
    // 输了
    console.log("lose:" + this.name);
};
// 死亡
Hero.prototype.die = function(){
    this.state = 'dead';
    // 给中介者发送消息，玩家死亡
    playerDirector.ReceiveMessage('playerDead',this);
}
// 移除玩家
Hero.prototype.remove = function(){
    // 给中介者发送一个消息，移除一个玩家
    playerDirector.ReceiveMessage('removePlayer',this);
};
// 玩家换队
Hero.prototype.changeTeam = function(color) {
    // 给中介者发送一个消息，玩家换队
    playerDirector.ReceiveMessage('changeTeam',this,color);
};
// 定义一个工厂类来创建玩家 
var heroFactory = function(name,teamColor) {
    // 创建一个新的玩家对象
    var newHero = new Hero(name,teamColor);
    // 给中介者发送消息，新增玩家
    playerDirector.ReceiveMessage('addPlayer',newHero);
    return newHero;
};
var playerDirector = (function(){
    var players = {},  // 保存所有的玩家
        operations = {}; // 中介者可以执行的操作
    // 新增一个玩家操作
    operations.addPlayer = function(player) {
        // 获取玩家队友的颜色
        var teamColor = player.teamColor;
        // 如果该颜色的玩家还没有队伍的话，则新成立一个队伍
        players[teamColor] = players[teamColor] || [];
        // 添加玩家进队伍
        players[teamColor].push(player);
     };
    // 移除一个玩家
    operations.removePlayer = function(player){
        // 获取队伍的颜色
        var teamColor = player.teamColor,
        // 获取该队伍的所有成员
        teamPlayers = players[teamColor] || [];
        // 遍历
        for(var i = teamPlayers.length - 1; i>=0; i--) {
            if(teamPlayers[i] === player) {
                teamPlayers.splice(i,1);
            }
        }
    };
    // 玩家换队
    operations.changeTeam = function(player,newTeamColor){
        // 首先从原队伍中删除
        operations.removePlayer(player);
        // 然后改变队伍的颜色
        player.teamColor = newTeamColor;
        // 增加到队伍中
        operations.addPlayer(player);
    };
    // 玩家死亡
	operations.playerDead = function(player) {
    var teamColor = player.teamColor,
    // 玩家所在的队伍
    teamPlayers = players[teamColor];

    var all_dead = true;
    //遍历 
    for(var i = 0,player; player = teamPlayers[i++]; ) {
    	if(player.state == 'dead') {
           player.lose();
        }
    }    
    for(var i = 0,player; player = teamPlayers[i++]; ) {
        if(player.state !== 'dead') {
            all_dead = false;
            break;
        }
    }
    // 如果all_dead 为true的话 说明全部死亡
    if(all_dead) {
        for(var i = 0, player; player = teamPlayers[i++]; ) {
            // 本队所有玩家lose
            player.lose();
        }
        for(var color in players) {
            if(color !== teamColor) {
                // 说明这是另外一组队伍
                // 获取该队伍的玩家
                var teamPlayers = players[color];
                for(var i = 0,player; player = teamPlayers[i++]; ) {
                    player.win(); // 遍历通知其他玩家win了
                }
            }
        }
    }
	};
	var ReceiveMessage = function(){
	    // arguments的第一个参数为消息名称 获取第一个参数
	    var message = Array.prototype.shift.call(arguments);
	    operations[message].apply(this,arguments);
	};
	return {
	    ReceiveMessage : ReceiveMessage
	};
})();
// 红队
var p1 = heroFactory("aa",'red'),
    p2 = heroFactory("bb",'red'),
    p3 = heroFactory("cc",'red'),
        p4 = heroFactory("dd",'red');
        
    // 蓝队
    var p5 = heroFactory("ee",'blue'),
        p6 = heroFactory("ff",'blue'),
        p7 = heroFactory("gg",'blue'),
        p8 = heroFactory("hh",'blue');
    // 让红队玩家全部死亡
    // p1.die();
    p2.die();
    p3.die();
    p4.die();
    // lose:aa lose:bb lose:cc lose:dd 
   // win:ee win:ff win:gg win:hh