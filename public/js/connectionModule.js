var temp;
var start_point_url = "http://localhost:3000/";
var path_url = start_point_url +"resources/images/";
var resultpath_url = start_point_url +"resources/selectedimages/";
var path_length = path_url.length;

function post_imgUrl(page, imgname){

	var end_point_url = "/"+page+"/send_imgUrl"

	var imgId = imgname+"-image";
	var img = document.getElementById(imgId);
	var imgUrl = img.src;
	imgUrl =imgUrl.substring(path_length, imgUrl.length);

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
	    data: {"imgUrl":imgUrl},
			success  : post_imgUrl_success,
			error	 : ajax_error,
	});


}

function post_imgUrl_success(result) {
	if(result['result'] == true){
		// 성공 처리

		success_sendImg();
	}else{
		//error 처리
		fail_sendImg();
	}

}

function post_maskImgUrl(page, imgDataUrl){
	var end_point_url = "/"+page+"/send_maskImgUrl"

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
	    data: {"imgDataUrl":imgDataUrl},
			success  : post_maskImgUrl_success,
			error	 : ajax_error,
	});

}

function post_maskImgUrl_success(result) {
	if(result['result'] == true){
		// 성공 처리
		success_sendMaskImg();
	}else{
		//error 처리
		fail_sendMaskImg();
	}
}

function post_sendEmail(page, emailAddress){
	var end_point_url = "/"+page+"/send_email"
	alert(emailAddress);
	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
	    data: {"emailAddress":emailAddress},
			success  : post_sendEmail_success,
			error	 : ajax_error,
	});

}

function post_sendEmail_success(result) {
	if(result['result'] == true){
		// 성공 처리

		success_sendEmail();
	}else{
		//error 처리
		fail_sendEmail();
	}
}

function post_loadImgList(page){

   var end_point_url = "/"+page+"/send_loadImgList";

   $.ajax({
       url : end_point_url,
       type : "POST",
       dataType:"json",
         success  : post_loadImgList_success,
         error    : ajax_error,
   });


}

function post_loadImgList_success(result) {
   if(result['result'] == true){
      // 성공 처리
      success_loadImgList(result['imgList']);
   }
}


function post_startAction(page){
	// 실행할수 있게 하는 코드 보내기
	
	var end_point_url = "/"+page+"/send_startAction";

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
			success  : post_startAction_success,
			error	 : ajax_error,
	});
	

}

function post_startAction_success(result) {
	if(result['result'] == true){
		// 성공 처리
		success_sendStartAction();
	}else{
		//error 처리
		fail_sendStartAction();
	}
	
}

function post_deleteImg(page){
	// 실행할수 있게 하는 코드 보내기
	
	var end_point_url = "/"+page+"/delete_img";

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
			success  : post_deleteImg_success,
			error	 : ajax_error,
	});
	

}

function post_deleteImg_success(result) {
	if(result['result'] == true){
		// 성공 처리
		success_sendDeleteImg();
	}else{
		//error 처리
		fail_sendDeleteImg();
	}
	
}

function post_deleteMaskImg(page){
	// 실행할수 있게 하는 코드 보내기
	
	var end_point_url = "/"+page+"/delete_maskImg";

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
			success  : post_deleteMaskImg_success,
			error	 : ajax_error,
	});
	

}

function post_deleteMaskImg_success(result) {
	if(result['result'] == true){
		// 성공 처리
		success_sendDeleteMaskImg();
	}else{
		//error 처리
		fail_sendDeleteMaskImg();
	}
	
}

function ajax_error(result) {
	//통신 실패
	alert('connect error');
}

function post_checkBeforeImg(page){
	var end_point_url = "/"+page+"/check_imgUrl"

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
			success  : post_checkBeforeImg_success,
			error	 : ajax_error,
	});

}

function post_checkBeforeImg_success(result) {
	if(result['result'] == true){
		// 성공 처리
		sucess_checkBeforImg(result['imgUrl']);
	}

}

function post_checkBeforeImg(page){
	var end_point_url = "/"+page+"/check_imgUrl"

	$.ajax({
	    url : end_point_url,
	    type : "POST",
	    dataType:"json",
			success  : post_checkBeforeImg_success,
			error	 : ajax_error,
	});

}

function post_checkBeforeImg_success(result) {
	if(result['result'] == true){
		// 성공 처리
		sucess_checkBeforImg(result['imgUrl']);
	}

}






function page_move(page){
	location.href=start_point_url + page;
}