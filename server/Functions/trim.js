module.exports = (object)=>{    
    if(object){
        object.value = object.value?object.value.trim():object.value;
        return object;
    }else return object;
}