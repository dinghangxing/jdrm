module.exports = {
  splitByPoint:function(str){
    var reg = /[,.?!;，。？！；、]/g;
    if(str === undefined){
      return "";
    }else{
     
      return str.split(reg);
    }
   
   
  }
}