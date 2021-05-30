module.exports = function funnyCrypt(str){
  let result = '';
  for (let j=0; j<str.length; j++){
    let b = str.charCodeAt(j)^(str.length%255);
    result += String.fromCharCode(b);
  }
  return result;
}
