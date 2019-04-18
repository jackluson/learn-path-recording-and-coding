console.log('start');

setTimeout(() => {          // callback1
  console.log(111);
  setTimeout(() => {        // callback2
    console.log(222);
  }, 0);
  setImmediate(() => {      // callback3
    console.log(333);
  })
  process.nextTick(() => {  // callback4
    console.log(444);
  })
}, 0);

setImmediate(() => {        // callback5
  console.log(555);
  process.nextTick(() => {  // callback6
    console.log(666);  
  })
})

setTimeout(() => {          // callback7              
  console.log(777);
  process.nextTick(() => {  // callback8
    console.log(888);
  })
}, 0);

process.nextTick(() => {    // callback9
  console.log(999);  
})
/* 
node 8.9.4
> 先执行当前宏任务阶段的所有任务,然后在去执行所有的微任务(6个阶段每阶段的宏任务队列执行完毕后，都会开始执行微任务),执行完当前的微任务队列,再回来继续执行宏任务的下一个阶段(or再从宏任务的第一阶段开始执行)
start
end 
999 
111 
777 
444 
888 
222 
555 
333 
666 

setTimeout(fn, 0)不是严格的0，一般是setTimeout(fn, 3)或什么，会有一定的延迟时间，当setTimeout(fn, 0)和setImmediate(fn)出现在同一段同步代码中时，就会存在两种情况。


第1种情况：同步代码执行完了，Timer还没到期，setImmediate回调先注册到Check Queue中，开始执行微队列，然后是宏队列，先从Timers Queue中开始，发现没回调，往下走直到Check Queue中有回调，执行，然后timer到期（只要在执行完Timer Queue后到期效果就都一样），timer回调注册到Timers Queue中，下一轮循环执行到Timers Queue中才能执行那个timer 回调；所以，这种情况下，setImmediate(fn)回调先于setTimeout(fn, 0)回调执行。


第2种情况：同步代码还没执行完，timer先到期，timer回调先注册到Timers Queue中，执行到setImmediate了，它的回调再注册到Check Queue中。 然后，同步代码执行完了，执行微队列，然后开始先执行Timers Queue，先执行Timer 回调，再到Check Queue，执行setImmediate回调；所以，这种情况下，setTimeout(fn, 0)回调先于setImmediate(fn)回调执行。


所以，在同步代码中同时调setTimeout(fn, 0)和setImmediate情况是不确定的，但是如果把他们放在一个IO的回调，比如readFile('xx', function () {// ....})回调中，那么IO回调是在IO Queue中，setTimeout到期回调注册到Timers Queue，setImmediate回调注册到Check Queue，IO Queue执行完到Check Queue，timer Queue得到下个周期，所以setImmediate回调这种情况下肯定比setTimeout(fn, 0)回调先执行。
*/
/*
node 11.14.0
** 执行一个宏任务就去遍历执行这个所有的微任务,执行完微任务就回来执行宏任务,再回来继续执行宏任务的下一个阶段,与浏览器保持一致
start
end  
999  
111  
444  
777  
888  
555  
666  
333  
222  
 */
console.log('end');