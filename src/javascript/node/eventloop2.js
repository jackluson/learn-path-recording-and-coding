console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})

new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})
process.nextTick(function() {
  console.log('6');
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
/* 
node 8.9.4
//* 执行完宏任务所在该阶段的任务再去执行微任务队列,然后返回来继续执行下面的宏任务阶段
1  
7  
6  
8  
2  
4  
9  
11 
3  
10 
5  
12 
 */
/* 
node 11.14.0
//* 执行一个宏任务就去执行微任务队列,然后返回来继续执行下面的宏任务阶段
1   
7   
6   
8   
2   
4   
3   
5   
9   
11  
10  
12  
 */