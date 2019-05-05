/*
* @Author: 18219
* @Date:   2019-05-04 18:17:48
* @Last Modified by:   18219
* @Last Modified time: 2019-05-04 18:46:09
*/

'use strict';
// 用于将一个个请求封装成对象,从而对不同的请求进行参数化,该模式提供我们一个统一的命令.通过参数的区分,将任务委托给各个具体对象
var carManager = (function(){
  return {
  	// execute: function ( name ) {
  	//   // console.log(this,name)
   //    return this[name] && this[name].apply(this, [].slice.call(arguments, 1) );
	  // },
 
    // request information
    requestInfo: function( model, id ){
      return "The information for " + model + " with ID " + id + " is foobar";
    },
 
    // purchase the car
    buyVehicle: function( model, id ){
      return "You have successfully purchased Item " + id + ", a " + model;
    },
 
    // arrange a viewing
    arrangeViewing: function( model, id ){
      return "You have successfully booked a viewing of " + model + " ( " + id + " ) ";
    }
  };
})();
carManager.execute = function ( name ) {
    return carManager[name] && carManager[name].apply( carManager, [].slice.call(arguments, 1) );
};
console.log(carManager.execute( "arrangeViewing", "Ferrari", "14523" ));
console.log(carManager.execute( "requestInfo", "Ford Mondeo", "54323" ));
carManager.execute( "requestInfo", "Ford Escort", "34232" );
carManager.execute( "buyVehicle", "Ford Escort", "34232" );
