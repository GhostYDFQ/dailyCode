const fs = require('fs');

// 创建目录的时候，需要保证父路径是存在的。
/*
mkdirSync 同步创建文件夹
 */

mkdirP('a/b/c/d/m/n/p',(err)=>{
    if(err){
        console.log(err);
    }
    console.log('创建完成');
})
// 异步 创建
function mkdirP(paths,cb) {
    let arr = paths.split('/');
    let index = 0;
    const next = (err) => {
        if(err) return cb(err);
        // 判断如果路径不存在就停止
        if(index === arr.length) return cb();
        let currentPath = arr.slice(0,++index).join('/');
        fs.access(currentPath,(err)=>{
            if(err){
                fs.mkdir(currentPath,next);
            }else{
                next();
            }
        })
    }
    next();
}

/*
// 同步 创建文件夹
function mkdirP(paths) {
    let arr = paths.split('/');
    for(let i = 1;i <= arr.length;i++ ){
        let currentPath = arr.slice(0,i).join('/');
        if(!fs.existsSync(currentPath)){
            fs.mkdirSync(currentPath);
        }
    }
}

// promise的方案
const fs = require('fs').promises;
async function mkdirP(paths){
    let arr = paths.split('/');
    for(let i = 1;i <= arr.length;i++ ){
        let currentPath = arr.slice(0,i).join('/');
        try{
            await fs.access(currentPath);
        }catch(e){
            await fs.mkdir(currentPath);
        }
        
    }
}
*/