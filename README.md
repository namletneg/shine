# shine
模拟刮奖效果
    主要实现是 采用 html5 的 canvas，在内容上罩一层模糊图片，通过手指滑动，将模糊图片去除；

去除核心：
    罩一层图片   ctx.dramImage(img,0,0,w,h);
    去除图片     ctx.globalCompositeOperation = "destination-out";
    手指形成路径  ctx.moveTo(),ctx.lineTo();

shine()函数有4个方法：
    getPosition(option)    //获取el的位置 
    eventDown()
    eventMove()
    eventUp()             //3个事件
