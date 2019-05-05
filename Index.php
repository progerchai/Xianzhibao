<?php
namespace app\store\controller;

use think\Controller;
use think\Db;

use app\store\model\User;
use app\store\model\Book;
use app\store\model\Comments;
use app\store\model\Shoppingcar;
use app\store\model\Collection;
use app\store\model\Orders;
use think\Request;

class Index
{
    public function index(){
        return 'this is store';
    }
    
    public function handHeadportrait(Request $request){
        if($request->isPost()){
            $image=$request->post('image');
            $openid=$request->post('openid');
            $imageName = $openid.'.png';
            if (strstr($image,",")){//判断是否有逗号 如果有就截取后半部分
                $image = explode(',',$image);
                $image = $image[1];
            }
            $path = "UserHeadProtrait";
            if (!is_dir($path)){ //判断目录是否存在 不存在就创建
                mkdir($path,0777,true);}
            $imageSrc=  $path."/". $imageName;  //图片名字
            $r = file_put_contents(ROOT_PATH ."public/".$imageSrc, base64_decode($image));//返回的是字节数
            if (!$r) {
                return json(["msg"=>"上传失败"]);
            }else{
                return json(["msg"=>"上传成功"]);
            }
        }
        return json(["msg"=>"上传失败"]);
    }
    
    public function register(Request $request){
        $res=0;
        if($request->isPost()){
            $openid=$request->post('openid');
            $nickname=$request->post('nickname');
            $headportrait_url=$request->post('headportrait_url');;
            $date=date_create();
            $submission_date= date_timestamp_get($date);
            try {
                User::create([
                'openid' => $openid,
                'nickname' => $nickname,
                'headportrait_url' =>$headportrait_url,
                 'submission_date'=>$submission_date,
            ]);
                $res=1;
            } catch (Exception $ex) {
                $res=-1;
            }
        }
        return json(["msg"=>$res]);
    }    
    
    public function showBooks(Request $request){
        $res=[];
        if($request->isGet()){
            $isAll=$request->get('isAll');
            try{
                if(!$isAll){
                $number= request()->get("number");
                $times=request()->get("times");
                $res= Book::where("type","eq",$request->get("type"))->limit(($times-1)*$number,$number)->select();
                } else {
                $res= Book::where("type","eq",$request->get("type"))->select();
                }
            } catch (Exception $ex) {
            }
        }
        return json($res);
    }
    //个人出售列表信息展示
    public function selfSellShow(Request $request){
        $res=[];
        if($request->isGet()){
            $openid=$request->get('openid');
            try{
              if($openid)
                $res= Book::where("openid","eq",$openid)->select();
            } catch (Exception $ex) {
            }
        }
        return json($res);
    }
    //搜索功能，简单检索数据库 name、discription  1
    public function query(Request $request){
        $res=[];
        if($request->isGet()){
          $querycontent=$request->get('querycontent');
            $map['name | introduce '] =array('like','%'.$querycontent.'%'); 
            try{
                $res= Book::where($map)->select();
            }
            catch (Exception $ex) {
            }
        }
        return json($res);
    }      
    //上传图片到服务器
    public function upLoadImg(Request $request){
      $file = request()->file('file');
      if ($file) {
        $info = $file->move('public/uploads/');
        if ($info) 
          {
            $file = $info->getSaveName();
            $res = ['errCode'=>0,'errMsg'=>'图片上传成功','file'=>$file];
            return json($res);
          }
       } 
    }

    public function addComment(Request $request){
        $res=0;
        if($request->isPost()){
            $bookid=$request->post('bookid');
            $comments=$request->post('comments');
            $openid=$request->post('openid');
            // openid,考虑删除，解除关联
            $nickName=$request->post('nickName');
            $avatarUrl=$request->post('avatarUrl');
            $comtime= date_timestamp_get(date_create());
            try {
                Comments::create([
                  'bookid'=>$bookid,
                'comments' =>$comments,
                'comtime'=>$comtime,
                'openid' => $openid,
                'nickName' => $nickName,
                'avatarUrl' => $avatarUrl, ]);
                $res=1;
            } catch (Exception $ex) {
                $res=-1;
            }
        }
        return json(["msg"=>$res]);
    }
    
    public function showComment(Request $request){
        $res=[];
        if($request->isGet()){
            $isUser=$request->get('isUser');
            if(!$isUser){
                $bookid= request()->get("bookid");
                $res= Comments::where("bookid","eq",$bookid)->select();
            } else {
                $openid=request()->get("openid");
                $res= Comments::where("openid","in",$openid)->select();
            }
        }
        return json($res);
    }
    
    public function getInformation(Request $request){
        $res=[];
        if($request->isGet()){
            $isUser=$request->get('isUser');
            if(!$isUser){
                $bookid = request()->get("bookid");
		$booklist = explode(",",$bookid);
		for($i = 0;$i<count($booklist);$i++)
		{
 			$temp= Book::where("bookid","eq",$booklist[$i])->select();
			if($temp){
				$res[$i]= $temp[0];
			}
		}
               
            } else {
                $openid=request()->get("openid");
                $res= User::where("openid","eq",$openid)->select();
            }
        }
        return json($res);
    }
    
    public function changeAddress(Request $request){
        $res=0;
        if($request->isPost()){
          $openid=$request->post('openid');
          $address=$request->post('address');
          User::where("openid","eq",$openid)->update(['address'=>$address]);
          $res=1;
       }
       return json(["msg"=>$res]);    
    }
    
    public function changePhone(Request $request) {
        $res=0;
        if($request->isPost()){
          $openid=$request->post('openid');
          $phone_number=$request->post('phone_number');
          User::where("openid","eq",$openid)->update(['phone_number'=>$phone_number]);
          $res=1;
       }
       return json(["msg"=>$res]);
   }
    
    public function addShoppingcar(Request $request) {
         $res=0;
        if($request->isPost()){
          $openid=$request->post('openid');
          $bookid=$request->post('bookid');
	 $boughtnumber=$request->post('boughtnumber');

          if(Shoppingcar::where("openid","eq",$openid)->where("bookid","eq",$bookid)->where("boughtnumber","eq",$boughtnumber)->count()){
              $res=-1;
          } else {
              Shoppingcar::create(['bookid'=>$bookid,'openid' => $openid,'boughtnumber' => $boughtnumber]);
              $res=1;
          }
       }
       return json(["msg"=>$res]);
    } 
   
    public function deleteShoppingcar(Request $request){
        $res=0;
        if($request->isPost()){
          $openid=$request->post("openid");
          $bookid=$request->post("bookid");
        try {
            Shoppingcar::where("openid","eq",$openid)->where("bookid","eq",$bookid)->delete();
            $res=1;
           } catch (Exception $ex) {
               $res=-1;
           }
        }
        return json(["msg"=>$res]);
    }
    
    public function showShoppingCar(Request $request){
        $res=[];
        if($request->isGet()){
            $res=Shoppingcar::where("openid","eq",$request->get("openid"))->select();
        }
        return json($res);
    }
    
    public function addCollect(Request $request) {
        $res=0;
        if($request->isPost()){
          $openid=$request->post('openid');
          $bookid=$request->post('bookid');
          if(Collection::where("openid","eq",$openid)->where("bookid","eq",$bookid)->count()){
              $res=-1;
          } else {
              Collection::create(['bookid'=>$bookid,'openid' => $openid]);
              $res=1;
          }
       }
       return json(["msg"=>$res]);
    } 
    
    public function deleteCollect(Request $request){
        $res=0;
        if($request->isPost()){
          $openid=$request->post("openid");
          $bookid=$request->post("bookid");
        try {
            Collection::where("openid","eq",$openid)->where("bookid","eq",$bookid)->delete();
            $res=1;
           } catch (Exception $ex) {
               $res=-1;
           }
        }
        return json(["msg"=>$res]);
    }
    
    public function showCollect(Request $request){
        $res=[];
        if($request->isGet()){
            $res= Collection::where("openid","eq",$request->get("openid"))->select();
        }
        return json($res);
    }
    
    public function submitOrder(Request $request){
        $res=0;
        if($request->isPost()){
            $bookid=$request->post('bookid');
            $ordertime=date_timestamp_get(date_create());
            $openid=$request->post('openid');
            $amount=$request->post('amount');
            $note=$request->post('note');
            $address=$request->post('address');
            $phone_number=$request->post('phone_number');
            $orderid=(string)$ordertime. (string)rand(10, 99);
            try {
                Orders::create(['orderid'=>$orderid,'bookid'=>$bookid,
                    'status'=>1,'ordertime'=>$ordertime,'openid' => $openid,'amount'=>$amount,
                    'note'=>$note,'address'=>$address,'phone_number'=>$phone_number]);
                $res=1;
            } catch (Exception $ex) {
                $res=-1;
            }
        }
        return json(["msg"=>$res]);
    }
    
    public function changeOrderState(Request $request) {
        $res=0;
        if($request->isPost()){
          $orderid=$request->post('orderid');
          $status=$request->post('status');
          Orders::where("orderid","eq",$orderid)->update(['status'=>$status]);
          $res=1;
       }
       return json(["msg"=>$res]);
   }
    
    public function showOrder(Request $request){
        $res=[];
        if($request->isGet()){
            $openid=$request->get("openid");
            $res=Orders::where("openid","eq",$openid)->select();
        }
         return json($res);
    }

    public function tryit(Request $request){
        $res=[];
        if($request->isGet()){
            $openid=$request->get("openid");
	    $res=Db::table('ORDER')->where('openid',1)->find();
         }
         return json($res);
    }

    public function getOpenid(Request $request){ // $code为小程序提供
        $code=$request->get("code");
        $appid = 'wx8823790438934868'; // 小程序APPID
        $secret = '475a41c77c2eaa8a0fb31094ae09656b'; // 小程序secret
        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' . $appid . '&secret='.$secret.'&js_code='.$code.'&grant_type=authorization_code';        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
        // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。    
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_URL, $url);
        $res = curl_exec($curl);
        curl_close($curl);
        return json($res); // 这里是获取到的信息
    }

     
}