var Tab=function(id){
      this.content=document.getElementById(id);
      this.ipts =this.content.getElementsByTagName('input');
      this.divs =this.content.getElementsByTagName('div');
    }
    Tab.prototype.change=function(){
      var that=this;
      this.divs[0].style.display='block';
      for(var i=0;i<this.ipts.length;i++){
        this.ipts[i].index=i;
        this.ipts[i].onclick=function(){
          for(var j=0;j<that.ipts.length;j++){
            that.divs[j].style.display='none';
          }
          that.divs[this.index].style.display='block';
          // that.divs[this.index].style.backgroundColor='green';
        }
      }
    }
    var tab=new Tab('tab');
    tab.change();