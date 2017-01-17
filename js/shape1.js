function shape(canvas,copy,cobj){
    this.canvas=canvas;
    this.copy=copy;
    this.cobj=cobj;
    this.width=canvas.width;
    this.height=canvas.height;
    this.type="line";
    this.style="stroke";
    this.strokeStyle="#000";
    this.fillStyle="#000";
    this.lineWidth=1;
    this.history=[];
    this.bianNum=5;
    this.jiaoNum=5;
    this.isback=true;
    this.xpsize=10;
    this.isshowxp=true;
}
shape.prototype={
    init:function(){
        this.cobj.lineWidth=this.lineWidth;
        this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.fillStyle=this.fillStyle;
    },
    draw:function(){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.copy.onmousemove=function(e){
                that.isback=true;
                that.init();
                that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
                var endx=e.offsetX;
                var endy=e.offsetY;
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                that.cobj.beginPath();
                that[that.type](startx,starty,endx,endy);
            }
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    line:function(x,y,x1,y1){
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    arc:function(x,y,x1,y1){
        this.cobj.arc(x,y,Math.sqrt((y1-y)*(y1-y)+(x1-x)*(x1-x)),0,Math.PI*2);
        this.cobj[this.style]();
    },
    sjx:function(x,y,x1,y1){
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    bian:function(x,y,x1,y1){
        var angle=360/this.bianNum*Math.PI/180;
        var r=Math.sqrt((y1-y)*(y1-y)+(x1-x)*(x1-x));
        for(var i=0;i<this.bianNum;i++){
            this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    djx:function(x,y,x1,y1){
        var angle=360/this.jiaoNum*Math.PI/180/2;
        var r=Math.sqrt((y1-y)*(y1-y)+(x1-x)*(x1-x));
        var r1=r/3;
        for(var i=0;i<this.jiaoNum;i++){
            this.cobj.lineTo(Math.cos(angle*2*i)*r+x,Math.sin(angle*2*i)*r+y);
            this.cobj.lineTo(Math.cos(angle*(2*i+1))*r1+x,Math.sin(angle*(2*i+1))*r1+y);
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen:function(){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.init();
                var endx=e.offsetX;
                var endy=e.offsetY;
                that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
               that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            }
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    xp:function(xpobj){
        var that=this;
        that.copy.onmousemove=function(e){
            if(!that.isshowxp){
                return false;
            }
            var movex=e.offsetX;
            var movey=e.offsetY;
            var lefts=movex-that.xpsize/2;
            var tops=movey-that.xpsize/2;
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.canvas.width-that.xpsize){
                lefts=that.canvas.width-that.xpsize
            }
            if(tops<0){
                tops=0;
            }
            if(tops>that.canvas.height-that.xpsize){
                tops=that.canvas.height-that.xpsize
            }
            xpobj.css({
                display:"block",
                left:lefts,top:tops,
                width:that.xpsize+"px",height:that.xpsize+"px"
            })
        }
        that.copy.onmousedown=function(e){
            that.copy.onmousemove=function(e){
                var movex=e.offsetX;
                var movey=e.offsetY;
                var lefts=movex-that.xpsize/2;
                var tops=movey-that.xpsize/2;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvas.width-that.xpsize){
                    lefts=that.canvas.width-that.xpsize
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvas.height-that.xpsize){
                    tops=that.canvas.height-that.xpsize
                }
                xpobj.css({
                    display:"block",
                    left:lefts,top:tops,
                    width:that.xpsize+"px",height:that.xpsize+"px"
                })
                that.cobj.clearRect(lefts,tops,that.xpsize,that.xpsize)
            }
           that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
               that.xp(xpobj);
               that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
            }
        }
    },
    select:function(selectareaobj){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            var minx,miny,w,h;
            that.init();
            that.copy.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    left:minx,
                    top:miny,
                    width:w,
                    height:h,
                    display:"block"
                })
            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);
            }
        }
    },
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            selectareaobj.css("cursor","move");
        }
        that.copy.onmousedown=function(e){
            var ax= selectareaobj.position().left;
            var ay= selectareaobj.position().top;
            var ox= e.clientX;
            var oy= e.clientY;
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var mx= e.clientX;
                var my= e.clientY;
                var lefts=(mx-ox)+ax;
                var tops=(my-oy)+ay;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvas.widht-w){
                    lefts=that.canvas.width-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvas.height-h){
                    tops=that.canvas.height-h;
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                })
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
                that.selectarea.style.border="1px dotted #000";
            }
            that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.drag(x,y,w,h,selectareaobj);
                that.selectarea.style.border="none";
            }
        }
    }
}