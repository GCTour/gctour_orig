<?php

 * @namespace GCTour\Map\Show
 * @uri /tour/save
 */
class TourSaveResource extends Resource {
   
   
    function post($request) {
   $response = new Response($request);
		
		if (isset($_POST['tour'])) {
            $tour = $_POST['tour'];
            
         
            $tour_obj = json_decode($tour);
            
            
          
            
            $response->code = Response::OK;
            $response->addHeader('Content-type', 'text/plain');
            $response->body = "tour saved";
        } else {
            $response->code = Response::BADREQUEST;
		}
		
        return $response;
        
    }


    function get_new_webcode($length=8) {
		$webcode = '';
		for ($i = 0; $i < $length; $i++) {
		  $letter = rand(0,1);
		  
		  if($letter == 1){
			 $webcode .= chr(rand(ord('A'), ord('Z'))); 
		  } else { // digit
			 $webcode .= chr(rand(ord('0'), ord('9'))); 
		  } 
		}	
		
		// check if it is unique
		$db = Database::obtain();
		$sql="SELECT webcode FROM `".TABLE_TOURS."` WHERE `webcode`='".$webcode."'";
			 
		$row = $db->query_first($sql);
		if(empty($row['webcode'])){
			return $webcode;
		} else {
			return get_new_webcode(); // recursive till webcode is unique!!!
		}
			  
	}


}
