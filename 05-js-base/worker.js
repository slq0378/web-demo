// worker.js 需要部署在服务器
// 在 worker 的上下文中，self 和 this 都指向 worker 的全局作用域。
// 监听message，是否开始干活
addEventListener('message',function(e){
    console.log("i am worker：",e.data);
    setTimeout(() => {
      postMessage({start:'2',index:2,state:'i am done!'});
    }, 4000);
})
// 终止worker执行
// close()
