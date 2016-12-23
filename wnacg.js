
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var util = require('util');

var request_option = {
    'method':'GET'
    ,'proxy': 'http://127.0.0.1:1080' //vpn代理端口
    ,'headers':{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
    }
    ,'timeout':20000
}

function getResponse(url,callback){
    request.get(url,request_option,function(err,res){
        if (err){
            console.log('[getResponse] Get Error: ')
            console.log(err)
            console.log('[getResponse] Start Retry ... ')
            getResponse(url,callback)
        }else{
            callback(res);
        }
    });
}

function re_match(text,pattern){
    var pattern_m = new RegExp(pattern,'m')
    var pattern_gm = new RegExp(pattern,'gm')
    var level = text.match(pattern).length; //正则重数
    if (level<=1){
        result_0 = text.match(pattern_gm);
        return result_0;
    }else{
        result_0 = text.match(pattern_gm);
        result_1 = [];
        for(var i=0;i<result_0.length;i++){
            result_1.push(result_0[i].match(pattern_m)[1])
        }
        return result_1;
    }
}

function getImg(url,path,callback){
    request(url,request_option,function(err,res){
        if(err){
            console.log('[getImg] Get Error at '+ url);
            //console.log(err);
            console.log('[getImg] Start Retry at '+url+' ... ')
            getImg(url,path,callback)
        }else{
            if (callback) callback(url,path);
        }
    }) 
    .pipe(fs.createWriteStream(path));
}

function cmkdir(dir_path){
    try{
        fs.accessSync(dir_path);
        var isAccess = true;
    }
   catch(err){
        var isAccess = false;
    }
    if(!isAccess){
        fs.mkdirSync(dir_path)
        console.log('Create Dir: '+dir_path)
        return true
    }
}

function format_num(num, n) { 
    return (Array(n).join(0) + num).slice(-n); 
} 

function download(clist){
    if(clist.length>0){
        var cid = clist.pop();
    }
    else{
        return;
    }
    var url = "http://m.wnacg.net/photos-index-aid-"+cid.toString()+".html";
    console.log(url)
    getResponse(url,function(res){
        var text = res.body;
        var comic_name = re_match(text,/<h2>(.+?)<\/h2>/)[0];
        console.log(comic_name)
        var dir_path = './comics/'+comic_name
        cmkdir(dir_path)
        var url = "http://m.wnacg.net/photos-gallery-aid-"+cid.toString()+".html";
        console.log(url);
        getResponse(url,function(res){
            var text = res.body;
            var result = re_match(text,/fast_img_host\+\\"(.+?)\\",/);
            var img_num = result.length.toString();
            console.log('images num: '+img_num);
            var finish_num = 0;
            for(key in result){
                if (result[key].indexOf('http')<0){
                    var img_url = 'http://m.wnacg.org'+result[key];
                }
                console.log('Start download image '+img_url+' ...')
                img_path = './comics/'+comic_name+'/'+format_num(key,img_num.toString().length)+'.jpg'
                getImg(img_url,img_path,function(img_url,img_path){
                    finish_num ++;
                    console.log(util.format('Finish download image %s as %s (%d/%d)',img_url,img_path,finish_num,img_num))
                    if(finish_num==img_num){
                        download(clist)
                    }
                })
            }
        });
    });
}

function test(){
    url = 'http://m.wnacg.org/data/0337/36/001.jpg'
    getImg(url,'./test_js.jpg',function(){
        console.log('finish');
    });
}

function main(){
    clist = [33985,33986];
    clist.reverse();
    download(clist);
}

//test()
main()


// NodeJs需要特别设置代理路径 为ss使用的本地端口
// Node存在根本问题,难以控制当前执行的最大任务数

