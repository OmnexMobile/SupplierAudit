var RNFS = require('react-native-fs');


export default {
    async ReadFile(cb){
        RNFS.readDir(RNFS.DocumentDirectoryPath) 
        .then((result) => {
          console.log('GOT RESULT', result);
          var index = undefined
    
          for(var i=0;i<result.length;i++){
            if(result[i].name =='reduxPersist'){
              if(index == 0){
                index = 0
              }
              else{
                index = i
              }
            }
          }
          // console.log('-->',index)
       
        //   stat the first file
          return Promise.all([RNFS.stat(result[index].path), result[index].path]);
        })
        .then((statResult) => {
            // console.log('statResult',statResult)
             RNFS.readDir(statResult[1]).then((result)=>{
            // console.log('Reading',result)
                    if (result[0].isFile()) {
                        // console.log('Its a file')
                        RNFS.readFile(result[0].path,'utf8').then((res)=>{
                            // console.log('Reading file...',JSON.parse(res)) 
                            var read = JSON.parse(res)
                            var parse = JSON.parse(read.audits)
                            // console.log('Reading file...',parse) 
                            cb(parse) 
                            // return parse;
                        })
                    }


             })
        })
        .then((contents) => {
          // log the file contents
          // console.log('Filestorage',contents)
        })
        .catch((err) => {
          // console.log(err.message, err.code);
        });
      }
}