/*
* @Author: 18219
* @Date:   2019-04-28 00:27:29
* @Last Modified by:   18219
* @Last Modified time: 2019-04-28 01:02:25
*/

'use strict';
/*
理解:组合模式（Composite）将对象组合成树形结构以表示“部分-整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。
 */
 // 第一步，先实现我们的“抽象类”函数MenuComponent：
var MenuComponent = function () {
};
MenuComponent.prototype.getName = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.getDescription = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.getPrice = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.isVegetarian = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.print = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.add = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.remove = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.getChild = function () {
    throw new Error("该方法必须重写!");
};
//第二步，创建基本的菜品项：
var MenuItem = function (sName, sDescription, bVegetarian, nPrice) {
    MenuComponent.apply(this);
    this.sName = sName;
    this.sDescription = sDescription;
    this.bVegetarian = bVegetarian;
    this.nPrice = nPrice;
};
MenuItem.prototype = new MenuComponent();
MenuItem.prototype.getName = function () {
    return this.sName;
};
MenuItem.prototype.getDescription = function () {
    return this.sDescription;
};
MenuItem.prototype.getPrice = function () {
    return this.nPrice;
};
MenuItem.prototype.isVegetarian = function () {
    return this.bVegetarian;
};
MenuItem.prototype.print = function () {
    console.log(this.getName() + ": " + this.getDescription() + ", " + this.getPrice() + "euros");
};
//第三步，创建菜品：
var MenuItem = function (sName, sDescription, bVegetarian, nPrice) {
    MenuComponent.apply(this);
    this.sName = sName;
    this.sDescription = sDescription;
    this.bVegetarian = bVegetarian;
    this.nPrice = nPrice;
};
MenuItem.prototype = new MenuComponent();
MenuItem.prototype.getName = function () {
    return this.sName;
};
MenuItem.prototype.getDescription = function () {
    return this.sDescription;
};
MenuItem.prototype.getPrice = function () {
    return this.nPrice;
};
MenuItem.prototype.isVegetarian = function () {
    return this.bVegetarian;
};
MenuItem.prototype.print = function () {
    console.log(this.getName() + ": " + this.getDescription() + ", " + this.getPrice() + "euros");
};
//由代码可以看出，我们只重新了原型的4个获取信息的方法和print方法，没有重载其它3个操作方法，因为基本菜品不包含添加、删除、获取子菜品的方式。

//第三步，创建菜品：

var Menu = function (sName, sDescription) {
    MenuComponent.apply(this);
    this.aMenuComponents = [];
    this.sName = sName;
    this.sDescription = sDescription;
    this.createIterator = function () {
        throw new Error("This method must be overwritten!");
    };
};
Menu.prototype = new MenuComponent();
Menu.prototype.add = function (oMenuComponent) {
    // 添加子菜品
    this.aMenuComponents.push(oMenuComponent);
};
Menu.prototype.remove = function (oMenuComponent) {
    // 删除子菜品
    var aMenuItems = [];
    var nMenuItem = 0;
    var nLenMenuItems = this.aMenuComponents.length;
    var oItem = null;

    for (; nMenuItem < nLenMenuItems; ) {
        oItem = this.aMenuComponents[nMenuItem];
        if (oItem !== oMenuComponent) {
            aMenuItems.push(oItem);
        }
        nMenuItem = nMenuItem + 1;
    }
    this.aMenuComponents = aMenuItems;
};
Menu.prototype.getChild = function (nIndex) {
    //获取指定的子菜品
    return this.aMenuComponents[nIndex];
};
Menu.prototype.getName = function () {
    return this.sName;
};
Menu.prototype.getDescription = function () {
    return this.sDescription;
};
Menu.prototype.print = function () {
    // 打印当前菜品以及所有的子菜品
    console.log(this.getName() + ": " + this.getDescription());
    console.log("--------------------------------------------");

    var nMenuComponent = 0;
    var nLenMenuComponents = this.aMenuComponents.length;
    var oMenuComponent = null;

    for (; nMenuComponent < nLenMenuComponents; ) {
        oMenuComponent = this.aMenuComponents[nMenuComponent];
        oMenuComponent.print();
        nMenuComponent = nMenuComponent + 1;
    }
};
// 第四步，创建指定的菜品：
var DinnerMenu = function () {
    Menu.apply(this);
};
DinnerMenu.prototype = new Menu();

var CafeMenu = function () {
    Menu.apply(this);
};
CafeMenu.prototype = new Menu();

var PancakeHouseMenu = function () {
    Menu.apply(this);
};
PancakeHouseMenu.prototype = new Menu();

// 第五步，创建最顶级的菜单容器——菜单本：
var Mattress = function (aMenus) {
    this.aMenus = aMenus;
};
Mattress.prototype.printMenu = function () {
    this.aMenus.print();
};
// 第六步，调用方式：
var oPanCakeHouseMenu = new Menu("Pancake House Menu", "Breakfast");
var oDinnerMenu = new Menu("Dinner Menu", "Lunch");
var oCoffeeMenu = new Menu("Cafe Menu", "Dinner");
var oAllMenus = new Menu("ALL MENUS", "All menus combined");

oAllMenus.add(oPanCakeHouseMenu);
oAllMenus.add(oDinnerMenu);

oDinnerMenu.add(new MenuItem("Pasta", "Spaghetti with Marinara Sauce, and a slice of sourdough bread", true, 3.89));
oDinnerMenu.add(oCoffeeMenu);

oCoffeeMenu.add(new MenuItem("Express", "Coffee from machine", false, 0.99));

var oMattress = new Mattress(oAllMenus);
console.log("---------------------------------------------");
// oMattress.printMenu();
console.log(oMattress.aMenus.aMenuComponents[1])
console.log("---------------------------------------------");
// 组合模式的关键是要有一个抽象类，它既可以表示子元素，又可以表示父元素。
// 组合模式在jq中的运用,组合模式允许我们对待单个对象,或者一组对象使用同种方法
// eg.
// Single elements
$( "#singleItem" ).addClass( "active" );
$( "#container" ).addClass( "active" );
 
// Collections of elements
$( "div" ).addClass( "active" );
$( ".item" ).addClass( "active" );
$( "input" ).addClass( "active" );
// 
//   
// 源码实现,使用了each 遍历
{  addClass: function( value ) {
  var classNames, i, l, elem,
    setClass, c, cl;
 
  if ( jQuery.isFunction( value ) ) {
    return this.each(function( j ) {
      jQuery( this ).addClass( value.call(this, j, this.className) );
    });
  }
 
  if ( value && typeof value === "string" ) {
    classNames = value.split( rspace );
 
    for ( i = 0, l = this.length; i < l; i++ ) {
      elem = this[ i ];
 
      if ( elem.nodeType === 1 ) {
        if ( !elem.className && classNames.length === 1 ) {
          elem.className = value;
 
        } else {
          setClass = " " + elem.className + " ";
 
          for ( c = 0, cl = classNames.length; c < cl; c++ ) {
            if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
              setClass += classNames[ c ] + " ";
            }
          }
          elem.className = jQuery.trim( setClass );
        }
      }
    }
  }
 
  return this;
}