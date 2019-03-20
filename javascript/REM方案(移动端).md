# REM方案(移动端)
rem方案是阿里为兼容几乎所有移动端页面，而想出来的。
阿里的方案具体可看githup：https://github.com/amfe/lib-flexible
####基础 
######>> css单位: rem; 
此单位会相对于html的font-size值进行倍数计算; 例如
```
<html>
    <style>
        html{
            font-size: 20px;
        }
        div{
            width:10rem; // 宽为 200px
            height:10rem; // 高为 200px
        }
    </style>
    <div></div>
</html>
```
######>> html标签 <meta name="viewport" content="">
设置它提供了关于可视窗口大小的设置。仅由移动设备使用。
<meta name="viewport">.

| 属性 | 值 | 描述  |
| :----: |:---:| :-----:|
| width | 正整数，或文字 device-width | 定义视口的像素宽度 |
| initial-scale | 0~10之间的正数 | 定义可视窗口的缩放比例 |
| maximum-scale | 0~10之间的正数 | 定义可视窗口的最大缩放比例,IOS10无视此设置 |
| minimum-scale | 0~10之间的正数 | 定义可视窗口的最小缩放比例,IOS10无视此设置 |
|user-scalable|yes 或者 no| no用户无法放大缩小页,默认yes。IOS10强制yes|

######>> dpr
设备独立像素也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统转换为物理像素。
- CSS像素

CSS像素是一个抽像的单位，主要使用在浏览器上，用来精确度量Web页面上的内容。一般情况之下，CSS像素称为与设备无关的像素(device-independent pixel)，简称DIPs。

- 屏幕密度

屏幕密度是指一个设备表面上存在的像素数量，它通常以每英寸有多少像素来计算(PPI)。

- 设备像素比(device pixel ratio)

设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。它的值可以按下面的公式计算得到：
```
设备像素比 ＝ 物理像素 / 设备独立像素
```
简单说:
以前在CSS 中的1px × 1px的大小，设备用1×1个像素点显示，dpr也就是1。
后来出了苹果出了视网膜屏幕，CSS 中的1px × 1px的大小，将像素点数量翻倍
 2 × 2个像素点显示 ,dpr就是2.   下图.

![image.png](http://upload-images.jianshu.io/upload_images/5539663-31deded8d575d1f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####具体实施
html中写入<meta name="viewport" >, 很重要整个方案都依赖它.
```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
注意 <meta name="flexible" content="initial-dpr=2" > 设置了这个值,会强制设置dpr. 不建议设置
```
在<head>中写JS 
```
var width = document.documentElement.clientWidth; // 获取宽度
var fontSize = width; // 这样1rem 就是页面的宽度.  建议除100 后面改。
document.documentElement.style.fontSize = fontSize + 'px';
```
 写css 假设页面设计稿的宽度是 750px, 里面有一个 30px的div
```
<style>
	div{
		width:0.04rem;
		height:0.04rem;
		background: red;
	}
</style>
<div></div>
```
现在在750px手机中显示为30px大小的div，其他宽度的手机进行按比例自动缩小.
问题：值很小的时候 比如1px 要转换为0.001333333333rem，浏览器可能会忽略过小值，所以要改一下将html的font-size缩小10(也利于将来转换为vw方案)
######注意 如果你缩小100倍，你可能会发现页面混乱了，因为pc中页面的字体会有最小限制，比如谷歌不允许小于12px。所以html的font-size成了12px所以布局乱了。  但是手机没有这个限制
```
//JS中
width = document.documentElement.clientWidth; // 获取宽度
fontSize = width / 10; 
document.documentElement.style.fontSize = fontSize + 'px';
//CSS中
<style>
	div{
		width:0.4rem; // 因为html字体缩小，所以这里相应增大
		height:0.4rem;
		background: red;
	}
</style>
//用SCSS预编译，写个函数.    手动写这些值太麻烦 用SCSS函数去改
@function rem($n){
    @return $n * 10rem / 750;  // 750是你设计图的宽度，如果设计图是300就写300.
}
```
字体不推荐用rem，用px, 例如将body设置为font-size:14px; 
按现在的写法,大多数情况也都能应对，各个手机兼容也没什么大问题。

但是如果要解决1px问题(设计师要物理像素的一像素点宽度，而不是css的1px)，就要在费周章了。
阿里方案的解决方法: 如果是dpr为2的屏幕，写1px，用<meta name="viewport" content="initial-scale=0.5">,来缩小为原来的0.5倍，这样就是1像素宽度了。 兼容性较好的方法。

在<head>中写JS
 ```
    //获取 已设置的<mate name="viewport">
    var vp = document.querySelector('meta[name="viewport"]');
    // devicePixelRatio 可以获取设备的dpr值 没有则写1
    var dpr = window.devicePixelRatio || 1;
    var style = document.getElementsByTagName("style")[0];
    var width = document.documentElement.clientWidth;
    // 后面会进行缩放dpr倍 所以要字体放大dpr倍
    var fontSize = width * dpr / 10;
    // 屏幕大 fontSize也会大  你可以设置个阈值，让大屏幕时布局按照小屏幕显示.  
    // 56代表,在屏幕大小,大于560px的屏幕, 布局按照560px的效果显示. 你可以更改
    fontSize =fontSize > dpr*56 ? dpr*56 : fontSize;
    document.documentElement.style.fontSize = fontSize + 'px';
    //为实现 1像素线   缩放为相应dpr
    vp.content = `initial-scale=${ 1 / dpr }, maximum-scale=${ 1 / dpr }, minimum-scale=${ 1 / dpr }, user-scalable=no`;
    if(style){
        // 给body设置相应的初始字体大小
        style.innerHTML += `body{
            font-size:${ dpr * 14 }px;
        }`;
    } else {
        document.getElementsByTagName("head")[0].innerHTML += `<style>
            body{
                font-size:${ dpr * 14 }px;
            }
        </style>`;
    };
```
CSS
```
布局还是使用 rem实现。
@function rem($n){
    @return $n * 10rem / 750;  // 750是你设计图的宽度，如果设计图是300就写300.
}
要使用1像素细线，直接写1px。
```
下面是我用iPhone6plus的效果，绿色边框是不使用此方案直接1px的效果，红色边框是此方案写1px实现1像素线的效果。
![6FFF244660C4F1FC5C35265C172294E5.png](http://upload-images.jianshu.io/upload_images/5539663-f8bd9870dba3fce1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

######适应下pc端
因为pc可能获取到dpr，但是<mate name="viewport">对PC是无效的所以进行下判断
```
    //是PC返回 true 否则 false;
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                return false;
            }
        }
        return true;
    }

    //获取 已设置的<mate name="viewport">
    var vp = document.querySelector('meta[name="viewport"]');
    // devicePixelRatio 可以获取设备的dpr值 没有则写1
    var dpr = window.devicePixelRatio || 1;
    //进行判断pc 手机
    if( IsPC() ){
        dpr = 1;
    }
    var style = document.getElementsByTagName("style")[0];
    var width = document.documentElement.clientWidth;
    // 后面会进行缩放dpr倍 所以要字体放大dpr倍
    var fontSize = width * dpr / 10;
    // 屏幕大 fontSize也会大  你可以设置个阈值，让大屏幕时布局按照小屏幕显示.  
    // 56代表,在屏幕大小,大于560px的屏幕, 布局按照560px的效果显示. 你可以更改
    fontSize =fontSize > dpr*56 ? dpr*56 : fontSize;
    document.documentElement.style.fontSize = fontSize + 'px';
    //为实现 1像素线   缩放为相应dpr
    vp.content = `initial-scale=${ 1 / dpr }, maximum-scale=${ 1 / dpr }, minimum-scale=${ 1 / dpr }, user-scalable=no`;
    if(style){
        // 给body设置相应的初始字体大小
        style.innerHTML += `body{
            font-size:${ dpr * 14 }px;
        }`;
    } else {
        document.getElementsByTagName("head")[0].innerHTML += `<style>
            body{
                font-size:${ dpr * 14 }px;
            }
        </style>`;
    };
```
写了一个<a href="https://weblzf.github.io/practice/newsRem/">Demo</a> . Githup<a href="https://github.com/weblzf/practice/tree/master/newsRem">代码地址</a>
有任何错误请指出！