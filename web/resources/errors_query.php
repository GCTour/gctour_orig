<?php

/**
 * @namespace GCTour\Errors\Query
 * @uri /errors/query
 */
class ErrorsQueryResource extends Resource {
   
   
	function post($request) {
		$response = new Response($request);
		
		if (isset($_POST['exception'])) {
			$db = Database::obtain();
			
			$exception = $_POST['exception'];
			
			
			$query_obj = array();
	
			$sql="SELECT * FROM `".TABLE_ERRORS."` WHERE `exception`='".$exception."'";
			$row = $db->query_first($sql);
			if(empty($row['id'])){
				$query_obj['exception'] = $_POST['exception'];
				$query_obj['appearance'] = 0;
				
			} else {
				$query_obj['exception'] = $row['exception'];
				$query_obj['first_submit'] = $row['first_submit'];
				$query_obj['appearance'] = $row['appearance'];
				if(!empty($row['solution'])){
					$query_obj['solution'] = $row['solution'];
				}
			}
            
            $response->code = Response::OK;
            $response->addHeader('Content-type', 'text/plain');
            $response->body = json_encode($query_obj);
        } else {
            $response->code = Response::BADREQUEST;
		}
		
        return $response;
        
    }
}
