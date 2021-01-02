module.exports = (object)=>{    
    if(object){
        object.value = object.value.trim();
        return object;
    }else return object;
}