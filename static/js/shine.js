/**
 * Created by f on 2015/4/30.
 */
(function($){
    $.shine = function(obj){
        var el = obj.el,      //考虑到可有会有多个 el， 所有不用 querySelector
            imgSrc = obj.imgSrc,
            clipRange = obj.clipRange || 40,      //涂抹范围
            lasting = obj.lasting || 120,     //涂抹长时间后 canvas 移除
            isClip = false,  //判断是否涂抹
            flag = 0,   //计数， 120 后隐藏 canvas
            //手指坐标
            startX = 0,
            startY = 0,
            moveX = 0,
            moveY = 0,
            //获取 el在 body 上的位置
            getPosition = function(option){
                var el = option,
                    x = 0,
                    y = 0;

                do{
                    x += el.offsetLeft;
                    y += el.offsetTop;
                } while(el = el.offsetParent);  //若 el 的上层元素为绝对定位，则 el.offsetParent 为该元素；如没定位，追溯到上层定位元素，直至到 body
                return {
                    x: x,
                    y: y
                }
            },
            //手指触摸
            eventDown = function(event){
                var canvas = event.target,
                    ctx = canvas.getContext('2d'),
                    offsetX = parseInt(canvas.style.left, 10),
                    offsetY = parseInt(canvas.style.top, 10),
                    hasTouch = 'ontouchstart' in window ? true : false;

                startX = (hasTouch ? event.targetTouches[0].pageX : event.pageX) - offsetX;
                startY = (hasTouch ? event.targetTouches[0].pageY : event.pageY) - offsetY;
                isClip = true;
                flag += 2;
                event.preventDefault();

                ctx.save();
                ctx.beginPath();
                ctx.arc(startX, startY, clipRange/2, 0, 2*Math.PI);
                ctx.fill();
                ctx.restore();
            },
            //手指滑动
            eventMove = function(event){
                var canvas = event.target,
                    ctx = canvas.getContext('2d'),
                    offsetX = parseInt(canvas.style.left, 10),
                    offsetY = parseInt(canvas.style.top, 10),
                    hasTouch = 'ontouchstart' in window ? true : false;

                event.preventDefault();
                if(isClip){
                    moveX = (hasTouch ? event.targetTouches[0].pageX : event.pageX) - offsetX;
                    moveY = (hasTouch ? event.targetTouches[0].pageY : event.pageY) - offsetY;
                    flag++;

                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = clipRange;
                    ctx.lineCap = 'round';
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(moveX, moveY);
                    ctx.stroke();
                    ctx.restore();

                    startX = moveX;
                    startY = moveY;
                }
            },
            //手指离开
            eventUp = function(event){
                var canvas = event.target;

                event.preventDefault();
                isClip = false;
                if(flag > lasting){
                    document.body.removeChild(canvas);
                }
            },
            init = function(option){
                var el = option,
                    w = el.offsetWidth,   //offsetWidth 为 width + padding + border
                    h = el.offsetHeight,
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    img = new Image(),
                    position = getPosition(el),
                    x, y,   //el 的位置
                    //判断浏览器在PC端或移动端
                    hasTouch = 'ontouchstart' in window ? true : false,
                    tapStart = hasTouch ? "touchstart":"mousedown",
                    tapMove = hasTouch ? "touchmove":"mousemove",
                    tapEnd = hasTouch ? "touchend":"mouseup";

                x = position.x;
                y = position.y;
                canvas.width = w;
                canvas.height= h;
                canvas.style.cssText = 'position: absolute; left: ' + x + 'px; top: ' + y + 'px; z-index: 999;';

                img.src = imgSrc;
                img.onload = function(){
                    ctx.drawImage(img, 0, 0, w, h);
                    document.body.appendChild(canvas);
                    el.style.visibility = 'visible';
                    ctx.globalCompositeOperation = "destination-out";     //抹去模糊图片
                    canvas.addEventListener(tapStart, eventDown);
                    canvas.addEventListener(tapMove, eventMove);
                    canvas.addEventListener(tapEnd, eventUp);

                    //窗口大小变化时， 模糊图片位置改变
                    window.onresize = function(){
                        position = getPosition(el);
                        canvas.style.left = position.x + 'px';
                        canvas.style.top = position.y + 'px';
                    };
                };
            };

        init(el);
    };
})(window);